import React, { useState, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import {Slate, Editable, withReact, ReactEditor} from 'slate-react'
import { withHistory } from 'slate-history'

interface Props {
    tip: string,
    onchange?: (value:Descendant[])=>void
}
const PlainTextExample = ({tip,onchange}:Props) => {
    const [value, setValue] = useState<Descendant[]>(function () {
        return([{
            type: "paragraph",
            children: [
                { text: tip || '' },
            ],
        }])
    })
    const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), [])
    return (
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
            <Editable placeholder="在这里记录些什么吧..." />
        </Slate>
    )
}


export default PlainTextExample