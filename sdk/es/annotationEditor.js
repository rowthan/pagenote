import { render } from 'preact';
import ContentEditable from "react-contenteditable";
import './assets/styles/editor.scss';
export default function AnnotationEditor(_a) {
    var tip = _a.tip, onchange = _a.onchange, root = _a.root, text = _a.text, color = _a.color;
    return render(React.createElement("pagenote-block", { style: "--color:" + color, "aria-controls": 'annotation-editor' },
        React.createElement("pagenote-block", { "aria-controls": "light-ref" }, text),
        React.createElement(ContentEditable, { html: tip, disabled: false, onChange: onchange, onKeyUp: function (e) { e.stopPropagation(); }, onClick: function (e) { e.stopPropagation(); }, tagName: 'pagenote-block' })), root);
}
//# sourceMappingURL=annotationEditor.js.map