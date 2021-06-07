/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

 import * as tf from '@tensorflow/tfjs'

 import {createDeepQNetwork} from '../agency/DQN';
 import {ReplayMemory} from '../agency/ReplayMemory';
 export const ALL_ACTIONS = [0,1,2,3,4,5,6,7];
 export const NUM_ACTIONS = ALL_ACTIONS.length;

 export class DQNTrainer {
   /**
    * Constructor of DQNTrainer.
    *
    * @param {object} config The configuration object with the following keys:
    *   - `replayBufferSize` {number} Size of the replay memory. Must be a
    *     positive integer.
    *   - `epsilonInit` {number} Initial value of epsilon (for the epsilon-
    *     greedy algorithm). Must be >= 0 and <= 1.
    *   - `epsilonFinal` {number} The final value of epsilon. Must be >= 0 and
    *     <= 1.
    *   - `epsilonDecayFrames` {number} The # of frames over which the value of
    *     `epsilon` decreases from `episloInit` to `epsilonFinal`, via a linear
    *     schedule.
    *   - `learningRate` {number} The learning rate to use during training.
    */
   constructor(config) {
     this.epsilonInit = config.epsilonInit;
     this.epsilonFinal = config.epsilonFinal;
     this.epsilonDecayFrames = config.epsilonDecayFrames;
     this.epsilonIncrement_ = (this.epsilonFinal - this.epsilonInit) /
         this.epsilonDecayFrames;
 
     this.onlineNetwork =
         createDeepQNetwork(config.height,  config.width, 8);
     this.targetNetwork =
         createDeepQNetwork(config.height,  config.width, 8);
     this.targetNetwork.trainable = false;
 
     this.optimizer = tf.train.adam(config.learningRate);
 
     this.replayBufferSize = config.replayBufferSize;
     this.replayMemory = new ReplayMemory(config.replayBufferSize);
     this.episodeCount = 1;
	 this.height = config.height;
	 this.width = config.width;
	 this.caughtEvaders = 0;
     this.reset();
   }
 
   reset = () => {
     this.cumulativeReward_ = 0;
   }
   setWorld = (world) => {
       this.world = world;
   }
   setPursuers = (pursuers) => {
     this._pursuers = pursuers;
   }
   incrementEpisodeCount = () => {
	   this.episodeCount += 1;
   }
   getCumulativeReward = () => {
	   return this.cumulativeReward;
   }
   getCaughtEvaders = () => {
	   return this.caughtEvaders;
   }
   /**
    * Play one step of the game.
    *
    * @returns {number | null} If this step leads to the end of the game,
    *   the total reward from the game as a plain number. Else, `null`.
    */

	getState = () => {
		return {
			"o": this.world.terrain.obstacleCells.slice(),
			"e": this.world.evaders.map(a => [this.world.terrain.mesh.getI(a.position.x), this.world.terrain.mesh.getJ(a.position.y)]).slice(),
			"p": this.world.pursuers.map(a => [this.world.terrain.mesh.getI(a.position.x), this.world.terrain.mesh.getJ(a.position.y)]).slice(),
		}
	}

	getStateTensor = (state, h, w) => {
		if (!Array.isArray(state)) {
			state = [state];
		}
		const numExamples = state.length;
		// TODO(cais): Maintain only a single buffer for efficiency.
		const buffer = tf.buffer([numExamples, h, w, 2]);
		
		for (let n = 0; n < numExamples; ++n) {
			if (state[n] == null) {
				continue;
			}
			// Mark the obstacles.
			state[n].o.forEach((yx, i) => {
				buffer.set(1, n, yx[0], yx[1], 0);
			});
			state[n].e.forEach((yx, i) => {
				buffer.set(1, n, yx[0], yx[1], 1);
			});
			state[n].p.forEach((yx, i) => {
				buffer.set(1, n, yx[0], yx[1], 2);
			});
		}
		return buffer.toTensor();
	}

	playStep = () => {
		let action;
		const state = this.getState();
		this.epsilon = this.episodeCount >= this.epsilonDecayFrames ?
			this.epsilonFinal :
			this.epsilonInit + this.epsilonIncrement_ * this.episodeCount;

		for (const pursuer of this._pursuers) {
			if (Math.random() < this.epsilon) {
				// Pick an action at random.
				action = Math.floor((8 - 0) * Math.random()) + 8;
			} else {
				// Greedily pick an action based on online DQN output.
				tf.tidy(() => {
					const stateTensor =
						this.getStateTensor(state, this.height, this.width)
					var action = ALL_ACTIONS[this.onlineNetwork.predict(stateTensor).argMax(-1).dataSync()[0]];
				});
			}
			pursuer.setActionInt(action);
		}
		const done = this.world.update();
		const nextState = this.getState();
		const reward = this.world.reward;
		const caughtEvaders = this.world.numEvadersCaught;
		
		this.replayMemory.append([state, action, reward, done, nextState]);

		this.cumulativeReward += reward;
		this.caughtEvaders += caughtEvaders;
		return done;
  }
 
  //  /**
  //   * Perform training on a randomly sampled batch from the replay buffer.
  //   *
  //   * @param {number} batchSize Batch size.
  //   * @param {number} gamma Reward discount rate. Must be >= 0 and <= 1.
  //   * @param {tf.train.Optimizer} optimizer The optimizer object used to update
  //   *   the weights of the online network.
  //   */
   trainOnReplayBatch(batchSize, gamma, optimizer) {
     // Get a batch of examples from the replay buffer.
     const batch = this.replayMemory.sample(batchSize);
     const lossFunction = () => tf.tidy(() => {
       const stateTensor = this.getStateTensor(
           batch.map(example => example[0]), this.height, this.width);
       const actionTensor = tf.tensor1d(
           batch.map(example => example[1]), 'int32');
       const qs = this.onlineNetwork.apply(stateTensor, {training: true})
           .mul(tf.oneHot(actionTensor, NUM_ACTIONS)).sum(-1);
 
       const rewardTensor = tf.tensor1d(batch.map(example => example[2]));
       const nextStateTensor = this.getStateTensor(
           batch.map(example => example[4]), this.height, this.width);
       const nextMaxQTensor =
           this.targetNetwork.predict(nextStateTensor).max(-1);
       const doneMask = tf.scalar(1).sub(
           tf.tensor1d(batch.map(example => example[3])).asType('float32'));
       const targetQs =
           rewardTensor.add(nextMaxQTensor.mul(doneMask).mul(gamma));
       return tf.losses.meanSquaredError(targetQs, qs);
     });
 
     // Calculate the gradients of the loss function with repsect to the weights
     // of the online DQN.
     const grads = tf.variableGrads(lossFunction);
     // Use the gradients to update the online DQN's weights.
     optimizer.applyGradients(grads.grads);
     tf.dispose(grads);
     // TODO(cais): Return the loss value here?
   }
 }
 