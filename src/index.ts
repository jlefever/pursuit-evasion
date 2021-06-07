import "./web/style/index.css";
import "./web/style/fontawesome/fontawesome.min.css";
import "./web/style/bulma.min.css";
import "./web/style/bulma-slider.min.css";
import App from "./web/components/App";
import Terrain from "./pe/terrain/Terrain";
import GameDefaults from "./pe/game/GameDefaults";
import Victory from "./pe/game/Victory";
import {ReplayMemory} from "./pe/agency/ReplayMemory";
import {copyWeights, createDeepQNetwork} from './pe/agency/DQN';
import DQNAgent from "./pe/agency/DQNAgent";
import RunawayAgent from "./pe/agency/RunawayAgent";
import {DQNTrainer} from "./pe/game/DQNTrainer";
import * as tf from '@tensorflow/tfjs'
import * as fs from 'fs';
import {mkdir} from 'shelljs';

export default App;

class MovingAverager {
    constructor(bufferLength) {
      this.buffer = [];
      for (let i = 0; i < bufferLength; ++i) {
        this.buffer.push(null);
      }
    }
  
    append(x) {
      this.buffer.shift();
      this.buffer.push(x);
    }
  
    average() {
      return this.buffer.reduce((x, prev) => x + prev) / this.buffer.length;
    }
}

window.addEventListener("load", _ => main (), false);

async function main() {
    const width = 1515;
    const numHCells = 40;
    const numVCells = 26;

    const episodes = 10;
    let replayMemorySize = 1e4;
    let height = numVCells - 2;
    let dqnWidth = numHCells - 2;
    let epsilonInitial = 1.0;
    let epsilonFinal = 0.1;
    let epsilonDecayEpisodes = episodes / 10;
    let batchSize = 64;
    let gamma = 0.99;
    let learningRate = 1e-3;
    let targetNetworkSyncRate = episodes / 1000;
    let cumulativeRewardThreshold = 3500;
    let savePath = "./models/dqn";
    let logDir = "./logs";
    let summaryWriter = tf.node.summaryFileWriter(logDir);
    let frameCount = 0;

    const dqnTrainer = new DQNTrainer({
        replayBufferSize: replayMemorySize,
        epsilonInit: epsilonInitial,
        epsilonFinal: epsilonFinal,
        epsilonDecayFrames: epsilonDecayEpisodes,
        learningRate: learningRate,
        height: height,
        width: dqnWidth
      });

    for (let i = 0; i < dqnTrainer.replayBufferSize; ++i) {
        frameCount += 1;
        if (i == GameDefaults.MAX_GAME_LENGTH) {
            dqnTrainer.incrementEpisodeCount();
        }
        dqnTrainer.playStep();
    }
    
    let tPrev = new Date().getTime();
    let frameCountPrev = frameCount;
    const rewardAverager100 = new MovingAverager(100);
    const caughtAverager100 = new MovingAverager(100);

    const optimizer = tf.train.adam(learningRate);
    let episodeCountPrev = dqnTrainer.episodeCount;
    let averageReward100Best = -Infinity;

    while (true) {
        const terrain = new Terrain(numHCells, numVCells, width);
        const world = GameDefaults.createDefaultWorld(terrain);

        dqnTrainer.setWorld(world);
        dqnTrainer.setPursuers(world.pursuersObjects);

        frameCount += 1;
        dqnTrainer.trainOnReplayBatch(batchSize, gamma, optimizer);
        const done = dqnTrainer.playStep();
        if (done) {
          const t = new Date().getTime();
          const framesPerSecond =
              (frameCount - frameCountPrev) / (t - tPrev) * 1e3;
          tPrev = t;
          frameCountPrev = frameCount;
    
          rewardAverager100.append(dqnTrainer.getCumulativeReward());
          caughtAverager100.append(dqnTrainer.getCaughtEvaders());
          const averageReward100 = rewardAverager100.average();
          const averageEaten100 = caughtAverager100.average();
    
          console.log(
              `Frame #${frameCount}: ` +
              `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
              `eaten100=${averageEaten100.toFixed(2)} ` +
              `(epsilon=${dqnTrainer.epsilon.toFixed(3)}) ` +
              `(${framesPerSecond.toFixed(1)} frames/s)`);
          if (summaryWriter != null) {
            summaryWriter.scalar(
                'cumulativeReward100', averageReward100, frameCount);
            summaryWriter.scalar('eaten100', averageEaten100, frameCount);
            summaryWriter.scalar('epsilon', dqnTrainer.epsilon, frameCount);
            summaryWriter.scalar(
                'framesPerSecond', framesPerSecond, frameCount);
          }
          if (averageReward100 >= cumulativeRewardThreshold ||
              frameCount >= GameDefaults.MAX_GAME_LENGTH
              ) {
            break;
          }
          if (averageReward100 > averageReward100Best) {
            averageReward100Best = averageReward100;
            if (savePath != null) {
              if (!fs.existsSync(savePath)) {
                mkdir('-p', savePath);
              }
              await dqnTrainer.onlineNetwork.save(`file://${savePath}`);
              console.log(`Saved DQN to ${savePath}`);
            }
          }
        }
        if (frameCount % targetNetworkSyncRate === 0) {
          copyWeights(dqnTrainer.targetNetwork, dqnTrainer.onlineNetwork);
          console.log('Sync\'ed weights from online network to target network');
        }
    }
}