var md5 = require('md5');
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
var EMPTY_HASH = 'empty';
var WebPageItem = /** @class */ (function () {
    function WebPageItem(webPage) {
        // createAt: number;
        // deleted: boolean;
        // description: string;
        // expiredAt: number;
        // icon: string;
        // key: string;
        // lastSyncTime: number;
        // mtimeMs: number;
        // plainData: PlainData;
        // title: string;
        // updateAt: number;
        // url: string;
        // urls: string[];
        // version: string;
        this.data = {
            createAt: 0,
            deleted: false,
            description: "",
            icon: "",
            key: "",
            plainData: undefined,
            title: "",
            updateAt: 0,
            url: "",
            urls: [],
            version: ""
        };
        this.lastHash = EMPTY_HASH;
        this.setData(webPage);
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
        var currentHash = this.createDataHash();
        var changed = currentHash !== this.lastHash;
        this.lastHash = currentHash;
        return changed;
    };
    WebPageItem.prototype.isValid = function () {
        var plainData = this.data.plainData;
        return (plainData === null || plainData === void 0 ? void 0 : plainData.steps.length) > 0 || (plainData === null || plainData === void 0 ? void 0 : plainData.snapshots.length) > 0;
    };
    WebPageItem.prototype.createDataHash = function () {
        if (!this.isValid()) {
            return EMPTY_HASH;
        }
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
export { WebPageItem };
//# sourceMappingURL=Types.js.map