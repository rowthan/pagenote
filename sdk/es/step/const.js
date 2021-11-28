export var LightStatus;
(function (LightStatus) {
    LightStatus[LightStatus["UN_LIGHT"] = 0] = "UN_LIGHT";
    LightStatus[LightStatus["HALF"] = 1] = "HALF";
    LightStatus[LightStatus["LIGHT"] = 2] = "LIGHT";
})(LightStatus || (LightStatus = {}));
export var AnnotationStatus;
(function (AnnotationStatus) {
    AnnotationStatus[AnnotationStatus["HIDE"] = 0] = "HIDE";
    AnnotationStatus[AnnotationStatus["SHOW"] = 1] = "SHOW";
})(AnnotationStatus || (AnnotationStatus = {}));
// 删减字段，需要 插件同步修改
export var STORE_KEYS_VERSION_2_VALIDATE = ["x", "y", "id", "text", "tip", "bg", "time", "isActive", "offsetX", "offsetY", "parentW", "pre", "suffix", "images", "level", "lightStatus", "annotationStatus"];
//# sourceMappingURL=const.js.map