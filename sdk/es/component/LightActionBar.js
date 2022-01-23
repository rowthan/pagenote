import Tip from "@/component/tip/Tip";
import i18n from "@/locale/i18n";
import CopyIcon from "@/assets/images/copy.svg";
import DeleteIcon from "@/assets/images/delete.svg";
import NoteIcon from '@/assets/images/note.svg';
import { useState } from "react";
import Colors from "@/component/Colors";
import "@/component/light/light-node.scss";
export default function LightActionBar(_a) {
    var step = _a.step, colors = _a.colors;
    var data = step.data;
    var _b = useState(false), copied = _b[0], setCopy = _b[1];
    var _c = useState(step.data.bg), currentColor = _c[0], setCurrentColor = _c[1];
    var copyHightlight = function () {
        setCopy(true);
        setTimeout(function () {
            setCopy(false);
        }, 3000);
    };
    function onchangeColor(color) {
        setCurrentColor(color);
        step.data.bg = color;
    }
    return (React.createElement("pagenote-light-actions", null,
        React.createElement(Tip, { inner: true, message: i18n.t(copied ? 'copied' : 'copy_keyword_annotation') },
            React.createElement("pagenote-icon", { onClick: function () { step.copyToClipboard(false); copyHightlight(); }, onDblClick: function () { step.copyToClipboard(true); copyHightlight(); } },
                React.createElement(CopyIcon, { fill: currentColor, width: 20, height: 20 }))),
        React.createElement(Tip, { inner: true, message: i18n.t('comment') },
            React.createElement("pagenote-icon", { onClick: function () {
                    step.openEditor();
                } },
                React.createElement(NoteIcon, { fill: currentColor, width: 20, height: 20 }))),
        React.createElement(Tip, { inner: true, message: i18n.t('remove_marks') },
            React.createElement("pagenote-icon", null,
                React.createElement(DeleteIcon, { width: 20, height: 20, fill: currentColor, onClick: function () { step.delete(); } }))),
        React.createElement(Tip, { inner: true, message: i18n.t('change_color') },
            React.createElement(Colors, { colors: colors, current: currentColor, selectColor: onchangeColor }))));
}
//# sourceMappingURL=LightActionBar.js.map