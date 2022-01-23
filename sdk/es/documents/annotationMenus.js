import React, { useState } from 'react';
import Tip from "../component/tip/Tip";
import i18n from "../locale/i18n";
import CopyIcon from "../assets/images/copy.svg";
import DeleteIcon from "../assets/images/delete.svg";
import NoteIcon from '../assets/images/note.svg';
import PinIcon from '../assets/images/pin.svg';
import { writeTextToClipboard } from "../utils/document";
import Colors from "../component/Colors";
import { AnnotationStatus, LightStatus } from "../common/Types";
function LightActionBar(_a) {
    var step = _a.step, colors = _a.colors;
    var data = step.data;
    var _b = useState(false), copied = _b[0], setCopy = _b[1];
    var _c = useState(step.data.bg), currentColor = _c[0], setCurrentColor = _c[1];
    var _d = useState(step.data.annotationStatus), annotationStatus = _d[0], setStatus = _d[1];
    var copyHightlight = function (copyAll) {
        setCopy(true);
        var value = copyAll ? (data.text + '\n' + data.tip) : data.text;
        writeTextToClipboard(value);
        setTimeout(function () {
            setCopy(false);
        }, 3000);
    };
    function onchangeColor(color) {
        setCurrentColor(color);
        step.data.bg = color;
    }
    function changeAnnotationStatus() {
        if (data.annotationStatus === AnnotationStatus.SHOW) {
            data.annotationStatus = AnnotationStatus.HIDE;
            data.lightStatus = LightStatus.UN_LIGHT;
        }
        else {
            data.annotationStatus = AnnotationStatus.SHOW;
            data.lightStatus = LightStatus.LIGHT;
        }
    }
    step.addListener(function () {
        setStatus(step.data.annotationStatus);
        setCurrentColor(step.data.bg);
    }, false, 'actions');
    var pin = annotationStatus === AnnotationStatus.SHOW;
    return (React.createElement("pagenote-span", { onClick: function (e) { e.stopPropagation(); } },
        React.createElement(Tip, { placement: 'top', inner: true, message: (!pin ? i18n.t('pin') : i18n.t('un_pin')) + '[p]' },
            React.createElement("pagenote-icon", { inner: true, "aria-controls": 'pin', "data-status": pin ? 'pin' : '', onClick: changeAnnotationStatus },
                React.createElement(PinIcon, { fill: pin ? currentColor : '#fff' }))),
        React.createElement(Tip, { placement: "bottom", inner: true, message: i18n.t(copied ? 'copied' : 'copy_keyword_annotation') + '[c]' },
            React.createElement("pagenote-icon", { onClick: function () { return copyHightlight(false); }, onDblClick: function () { copyHightlight(true); } },
                React.createElement(CopyIcon, { fill: currentColor, width: 20, height: 20 }))),
        React.createElement(Tip, { placement: "top", inner: true, message: i18n.t('comment') + '[m]' },
            React.createElement("pagenote-icon", { onClick: function () {
                    step.openEditor();
                } },
                React.createElement(NoteIcon, { fill: currentColor, width: 20, height: 20 }))),
        React.createElement(Tip, { placement: "top", inner: true, message: i18n.t('change_color') },
            React.createElement(Colors, { colors: colors, current: currentColor, selectColor: onchangeColor })),
        React.createElement(Tip, { placement: "top", inner: true, message: i18n.t('remove_marks') },
            React.createElement("pagenote-icon", { "aria-controls": "delete-icon" },
                React.createElement(DeleteIcon, { width: 20, height: 20, fill: currentColor, onClick: function () { step.delete(); } })))));
}
export default function renderAnnotationMenu(rootElement, setting) {
    var light = setting.light, colors = setting.colors, _a = setting.moreActions, moreActions = _a === void 0 ? [] : _a;
    function generateOnclick(fun) {
        if (typeof fun === 'function') {
            return function (e) {
                fun(light);
                e.stopPropagation();
            };
        }
        else {
            return function (e) {
                e.stopPropagation();
            };
        }
    }
    // ReactDom.render(
    //     <div>
    //         <root.div>
    //             {/*<style type="text/css">{styles}</style>*/}
    //             <pagenote-menu>
    //                 <LightActionBar step={light} colors={colors}/>
    //                 {
    //                     moreActions.length>0 &&
    //                     <Popover message={
    //                         <pagenote-block>{
    //                             moreActions.map((item)=>(
    //                                 <pagenote-block
    //                                     data-role="more-action-item"
    //                                     onClick={generateOnclick(item.onclick)}>{item.text}</pagenote-block>
    //                             ))
    //                         }</pagenote-block>
    //                     } inner={true} placement='rightBottom' trigger='hover'
    //                     >
    //                         <pagenote-icon inner={true} aria-controls="more-icon">
    //                             <MoreIcon fill='#999'/>
    //                         </pagenote-icon>
    //                     </Popover>
    //                 }
    //             </pagenote-menu>
    //         </root.div>
    //     </div>
    //     ,rootElement)
}
//# sourceMappingURL=annotationMenus.js.map