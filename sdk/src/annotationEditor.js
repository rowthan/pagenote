import {render} from 'react-dom';
import ContentEditable from "react-contenteditable";
import './assets/styles/editor.scss'

export default function AnnotationEditor({tip,onchange,root,text,color}) {
    return render(<pagenote-block style={`--color:${color}`} aria-controls='annotation-editor'>
        <pagenote-block aria-controls="light-ref">{text}</pagenote-block>
        <ContentEditable
            html={tip} // innerHTML of the editable div
            disabled={false} // use true to disable edition
            onChange={onchange} // handle innerHTML change
            onKeyUp={(e)=>{e.stopPropagation();}}
            onClick={(e)=>{e.stopPropagation();}}
            tagName='pagenote-block'
        />
    </pagenote-block>,root)
}