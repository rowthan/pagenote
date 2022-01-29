/// <reference types="react" />
import { Position, Step } from "../common/Types";
import { IBrush } from "../types/Option";
interface Props {
    position: Position;
    brushes: IBrush[];
    showButton: boolean;
    target: Step;
    recordNew: (data: {
        bg: string;
    }) => void;
}
export default function ActionBars({ position, brushes, showButton, target, recordNew }: Props): JSX.Element;
export {};
