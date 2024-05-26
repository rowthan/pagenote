import {type ReactNode} from 'react';
import PopupPage from "./popup";

interface Props {
    children?: ReactNode;
}

export default function sidepanel(props: Props) {
    return (
        <PopupPage className={'!min-w-[250px]'} />
    );
}

