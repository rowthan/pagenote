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
import mustache from 'mustache';
var templates = {
    markdown: {
        template: "## [{{title}}]({{{url}}})\n{{#steps}}> * {{text}}\n\n{{#tip}}{{{tip}}}\n\n{{/tip}}{{/steps}}\n> \u5BFC\u51FA\u6A21\u677F\u57FA\u4E8E mustache \u8BED\u6CD5\n    ",
        fileExt: 'markdown',
        icon: '',
        name: 'markdown',
        description: '导出为Markdown格式'
    }
};
var dataToString = function (data, exportTemplate) {
    if (exportTemplate === void 0) { exportTemplate = templates.markdown; }
    var result = {
        success: false,
        data: null,
    };
    try {
        result.data = mustache.render(exportTemplate.template, __assign(__assign({}, data), { encodeUrl: encodeURIComponent(data.url) }));
        result.success = true;
    }
    catch (e) {
        console.error(e);
    }
    return result;
};
export { dataToString };
//# sourceMappingURL=data.js.map