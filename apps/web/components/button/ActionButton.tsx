import {type ReactNode} from 'react';
import classNames from "classnames";
import KeyboardTip from "../KeyboardTip";
import { Button } from "@/components/ui/button"

type Props = {
    children?: ReactNode;
    tip?: string
    keyboard?: string
    active?: boolean,
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function ActionButton(props: Props) {
    const {children, tip, active, keyboard = '', className, ...left} = props;
    return (
        <KeyboardTip command={keyboard} tip={tip}>
            <Button
                variant={active?"default":"outline"}
                size="icon"
                {...left}>
                {children}
            </Button>
        </KeyboardTip>
    );
}

ActionButton.defaultProps = {}
