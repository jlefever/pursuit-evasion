import { h, FunctionalComponent } from "preact";

interface SliderProps {
    value: number;
    setValue: (value: number) => void;
    min: number;
    max: number;
    step: number;
}

const comp: FunctionalComponent<SliderProps> = (props: SliderProps) => {
    const { value, setValue, min, max, step } = props;
    return <div class="control">
        <input
            type="range"
            class="slider has-output mt-0 mb-0"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
                e.preventDefault();
                setValue(parseInt((e.target as HTMLInputElement).value));
            }}
        />
        <output class="pr-2 pl-2">{value}</output>
    </div>;
};

export default comp;