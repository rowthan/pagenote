/// <reference types="react" />
import { Step } from "../common/Types";
interface Props {
    light: Step;
    remove: () => void;
}
export default function LightItem({ light, remove }: Props): JSX.Element;
export {};
