import { StepProps } from "./step/const";
interface StepOptions {
    colors: Array;
    renderAnnotation: any;
}
declare const Step: (info: StepProps, options: StepOptions, callback?: any) => void;
declare function Steps(option: any): void;
declare namespace Steps {
    var prototype: any[];
}
export { Step, Steps, };
