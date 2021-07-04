import { h, render,Component, Fragment} from 'preact';
import ContentEditable from "react-contenteditable";
import './assets/styles/editor.scss'

export default function AnnotationEditor({tip,onchange,root}) {
    return render(<ContentEditable
        html={tip} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={onchange} // handle innerHTML change
        onKeyUp={(e)=>{e.stopPropagation();}}
        tagName='pagenote-block'
    />,root)
}