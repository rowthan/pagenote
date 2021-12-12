function isLow(current, compareVersion, separator) {
    if (current === void 0) { current = '0.0.0'; }
    if (compareVersion === void 0) { compareVersion = ''; }
    if (separator === void 0) { separator = '.'; }
    if (current === compareVersion) {
        return false;
    }
    var firstVersion = current.split(separator);
    var secondVersion = compareVersion.split(separator);
    var isOld = true;
    for (var i = 0; i < secondVersion.length; i++) {
        var preVersion = parseInt(firstVersion[i]);
        var nexVersion = parseInt(secondVersion[i]);
        if (preVersion !== nexVersion) {
            isOld = preVersion < nexVersion;
            break;
        }
    }
    return isOld;
}
export { isLow, };
//# sourceMappingURL=compare.js.map