import Popover from '../tip/Popover';
import './LightRefAnotation.scss';
import ImageIcon from '../../assets/images/image.svg';
import i18n from '../../locale/i18n';
import Tip from '../tip/Tip';
export default function LightRefAnotation(_a) {
    var step = _a.step, showTarget = _a.showTarget;
    var data = step.data, runtime = step.runtime;
    var text = data.text || '';
    var notion = data.text !== data.tip ? data.tip : '';
    var imgs = data.images || [];
    var hasRelated = runtime.relatedNode.length > 0;
    return (React.createElement("pagenote-light-aside-ref", { onClick: function () {
            step.openEditor(false);
            step.gotoView();
            step.data.lightStatus = 2;
        }, onDblClick: function () {
            step.openEditor();
        }, "data-founded": hasRelated ? '1' : '0', "data-insign": data.isVisible ? '1' : '0', "data-active": data.isActive ? '1' : '0', style: { '--fill-color': data.bg } },
        React.createElement("pagenote-light-highlight", null,
            !hasRelated &&
                React.createElement(Tip, { message: i18n.t('not_found') },
                    React.createElement("i", { style: { fontSize: '12px' }, className: 'iconfont iconinfo' })),
            React.createElement("pagenote-light-inner", null,
                text.substring(0, 28),
                imgs.length ? React.createElement(Popover, { trigger: 'hover', message: imgs.map(function (img) { return (React.createElement("div", null,
                        React.createElement("img", { style: 'max-width:100px', src: img.src, alt: img.alt }))); }) },
                    React.createElement(ImageIcon, { style: { verticalAlign: 'sub', margin: '0 4px' } })) : ''))));
}
//# sourceMappingURL=LightRefAnotation.js.map