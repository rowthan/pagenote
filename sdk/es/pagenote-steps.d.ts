import Step from "./pagenote-step";
interface StepOption {
    saveDatas: Function;
}
declare class Steps extends Array {
    option: StepOption;
    lastFocus: string;
    constructor(option: StepOption);
    removeStep(lightId: string): void;
    save(): void;
    add(item: Step): void;
}
export default Steps;
