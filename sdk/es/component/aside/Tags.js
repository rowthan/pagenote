var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import Modali, { useModali } from 'modali';
import { DraggableAreasGroup } from 'react-draggable-tags';
import { useEffect, useRef, useState } from "preact/hooks";
import './tags.less';
var group = new DraggableAreasGroup();
var DraggableArea1 = group.addArea();
var App = function (_a) {
    var _b = _a.allTags, allTags = _b === void 0 ? [] : _b, initTagSets = _a.initTagSets, onchange = _a.onchange;
    var inputRef = useRef(null);
    var _c = useState([]), recommendTags = _c[0], setRecommend = _c[1];
    useEffect(function () {
        var meta = document.querySelector('meta[name="keywords"]');
        if (meta) {
            var keywords = meta.content || '';
            keywords = keywords.replaceAll(',', ' ').replaceAll('，', ' ').replaceAll('、', ' ');
            var keys = keywords.split(/\s/).filter(function (key) {
                return !!key;
            });
            setRecommend(keys);
        }
    }, []);
    var _d = useModali({
        animated: true,
        title: '为当前页面添加标签',
        message: "当前",
    }), exampleModal = _d[0], toggleExampleModal = _d[1];
    var currentArray = Array.from(initTagSets).filter(function (item) {
        return !!item;
    }).map(function (item) {
        return {
            id: item,
            content: item
        };
    });
    function addTag(input) {
        var value = typeof input === 'string' ? input : inputRef.current.value;
        if (value) {
            initTagSets.add(value);
            onchange(initTagSets);
            inputRef.current.value = '';
        }
    }
    var optionTags = allTags.map(function (item) {
        if (typeof item === 'object') {
            return item.label;
        }
        else {
            return item;
        }
    });
    var displayRecommendTags = __spreadArray(__spreadArray([], recommendTags, true), optionTags, true).filter(function (tag) {
        return !initTagSets.has(tag);
    });
    return (React.createElement("pagenote-block", null,
        React.createElement("pagenote-tags", { onClick: toggleExampleModal }, currentArray.length ?
            currentArray.map(function (tag) {
                return (React.createElement("pagenote-tag", null, tag.content));
            }) :
            React.createElement("pagenote-span", null, "#")),
        React.createElement(Modali.Modal, __assign({}, exampleModal),
            React.createElement("pagenote-block", { className: "CrossArea" },
                React.createElement("pagenote-block", { className: "area current" },
                    React.createElement("pagenote-p", null, "\u5DF2\u9009\u6807\u7B7E"),
                    React.createElement("pagenote-block", { className: 'selected-area' },
                        React.createElement(DraggableArea1, { tags: currentArray, render: function (_a) {
                                var tag = _a.tag;
                                return (React.createElement("div", { className: "tag", key: tag.id },
                                    tag.content,
                                    React.createElement("aside", { className: 'delete', onClick: function () {
                                            initTagSets.delete(tag.id);
                                            onchange(initTagSets);
                                        } })));
                            }, onChange: function (leftTags) {
                                // setCurrentArray(leftTags);
                                var tags = leftTags.map(function (item) { return item.content; });
                                var newSet = new Set(tags);
                                onchange(newSet);
                            } }))),
                React.createElement("pagenote-block", { className: "area rest" },
                    React.createElement("pagenote-p", null, "\u63A8\u8350\u6807\u7B7E"),
                    displayRecommendTags.map(function (tag) { return (React.createElement("span", { onClick: function () { addTag(tag); }, className: 'tag' }, tag)); })),
                React.createElement("pagenote-p", { style: { position: 'relative' } },
                    React.createElement("input", { ref: inputRef, type: "text", placeholder: '\u6DFB\u52A0\u65B0\u6807\u7B7E', onKeyUp: function (e) { console.log(e); if (e.key === 'Enter') {
                            addTag();
                        } } }),
                    React.createElement("button", { onClick: addTag }, "\u6DFB\u52A0"))))));
};
export default App;
//# sourceMappingURL=Tags.js.map