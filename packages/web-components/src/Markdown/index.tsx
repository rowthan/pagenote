import React, {FC, PropsWithChildren} from "react";
import Markdown from 'markdown-to-jsx'

interface Props {
    css?: string
    className?: string
    markdown: string
}

const Component: FC<PropsWithChildren<Props>> = (props) => {
    const {markdown} = props;

    return (
        <Markdown>
            {markdown}
        </Markdown>
    );
}
export default Component
