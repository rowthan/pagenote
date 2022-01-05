import { computePosition, convertColor, isMobile } from "@/utils";
import Highlight from '@/assets/images/highlight.svg';
import i18n from '@/locale/i18n';
import Tip from '../component/tip/Tip';
import './action-bar.scss';
export default function ActionBars(_a) {
    var pagenote = _a.pagenote;
    var recordButtonX = pagenote.target.x + 'px';
    var recordButtonY = pagenote.target.y + "px";
    var functionColors = pagenote.options.functionColors;
    var brushes = pagenote.options.brushes;
    var showButton = (pagenote.status === pagenote.CONSTANT.WAITING ||
        pagenote.status === pagenote.CONSTANT.PLAYANDWAIT);
    var canHighlight = pagenote.target && pagenote.target.canHighlight;
    function recordNew(item, level) {
        pagenote.record({
            bg: item.bg,
            level: level || item.level,
        });
    }
    var showAnimation = pagenote.options.showIconAnimation;
    return (React.createElement("pagenote-block", { style: {
            position: "absolute",
            zIndex: 2147483648,
            left: recordButtonX,
            top: recordButtonY,
            transition: ".5s",
            userSelect: "none",
            textAlign: 'left'
        } }, showButton
        &&
            React.createElement("pagenote-block", { onClick: function (e) { e.stopPropagation(); } },
                canHighlight &&
                    React.createElement("pagenote-colors-container", null, brushes.map(function (item, index) {
                        var radios = 30;
                        var _a = (isMobile || index === 0) ? {
                            x: (index) * -40,
                            y: 0,
                        } : computePosition(index - 1, radios), offsetX = _a.x, offsetY = _a.y;
                        if (!item) {
                            return (React.createElement("pagenote-color-button", null));
                        }
                        return (React.createElement("pagenote-color-button", { "data-pagenotecolor": item.bg, style: {
                                '--color': item.bg,
                                transform: "translate(" + offsetX + "px," + -offsetY + "px)",
                                top: (offsetY) + 'px',
                                left: (-offsetX) + 'px',
                                width: radios + 'px',
                                height: radios + 'px',
                                color: convertColor(item.bg).textColor,
                                textShadow: "1px 1px 0px " + convertColor(convertColor(item.bg).textColor).textColor,
                                // animation:`${(showAnimation&&index!==0)?'colorShow 3s ease-out':''}`,
                                // animationDelay: index*0.1+'s',
                                // transitionDelay: index*0.1+'s',
                            }, onMouseUpCapture: function (e) { recordNew(item); } }, index !== 0 ? item.shortcut :
                            React.createElement("span", null,
                                React.createElement(Highlight, { "data-pagenotecolor": item.bg, style: { userSelect: 'none' }, fill: item.bg }))));
                    })),
                React.createElement("pagenote-addons", null, functionColors.map(function (actionGroup, index) {
                    // actionGroup filter when
                    return (React.createElement("pagenote-plugin-group", { style: {
                            // left: ((index+1)*34+4) + 'px',
                            animationDelay: (index + 1) * 0.2 + 's',
                        } }, actionGroup.map(function (action, j) {
                        if (!action) {
                            return ('');
                        }
                        var _a = action || {}, icon = _a.icon, name = _a.name, shortcut = _a.shortcut, eventid = _a.eventid, id = _a.id;
                        var image = /^<svg/.test(icon) ? "data:image/svg+xml;base64," + window.btoa(icon) : icon;
                        return (React.createElement(Tip, { key: index + name + j, inner: true, message: "" + name + (shortcut ? i18n.t('shortcut') + "[" + shortcut + "]" : '') },
                            React.createElement("pagenote-action-button", { key: name, "data-eventid": eventid, style: {
                                    backgroundImage: "url(" + image + ")",
                                }, onClick: action.onclick, onMouseOver: action.onmouseover, onDblclick: action.ondbclick })));
                    })));
                })))));
}
//# sourceMappingURL=ActionBars.js.map