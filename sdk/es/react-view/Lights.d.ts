/// <reference types="react" />
import { Step } from "../common/Types";
interface Props {
    lights: Step[];
    remove: (index: number) => void;
}
export default function Lights({ lights, remove }: Props): JSX.Element;
export {};
