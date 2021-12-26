import md5 from 'md5';
var AnnotationStatus;
(function (AnnotationStatus) {
    AnnotationStatus[AnnotationStatus["fixed"] = 1] = "fixed";
    AnnotationStatus[AnnotationStatus["un_fixed"] = 0] = "un_fixed";
})(AnnotationStatus || (AnnotationStatus = {}));
var LightStatus;
(function (LightStatus) {
    LightStatus[LightStatus["un_light"] = 0] = "un_light";
    LightStatus[LightStatus["half_light"] = 1] = "half_light";
    LightStatus[LightStatus["light"] = 2] = "light";
})(LightStatus || (LightStatus = {}));
var WebPageItem = /** @class */ (function () {
    function WebPageItem(webPage) {
        this.setData(webPage);
        this.initHash = this.createDataHash();
    }
    WebPageItem.prototype.setData = function (webPage) {
        for (var i in webPage) {
            // @ts-ignore
            if (webPage[i] !== undefined) {
                // @ts-ignore
                this.data[i] = webPage[i];
            }
            this.data.updateAt = Date.now();
        }
    };
    WebPageItem.prototype.isValid = function () {
        var _a = this.data, plainData = _a.plainData, expiredAt = _a.expiredAt;
        return expiredAt > Date.now() && plainData.steps.length > 0 && plainData.snapshots.length > 0;
    };
    WebPageItem.prototype.createDataHash = function () {
        var data = this.data;
        var string = JSON.stringify({
            version: data.version,
            deleted: data.deleted,
            plainData: data.plainData,
            description: data.description,
            icon: data.icon,
            urls: data.urls,
        });
        return md5(string);
    };
    return WebPageItem;
}());
//# sourceMappingURL=Types.js.map