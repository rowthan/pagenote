function maskInfo(input) {
    var splitIndex = input.indexOf('@') === -1 ? input.length : input.indexOf('@');
    var maskPart = input.substr(0, splitIndex);
    var suffix = input.substr(splitIndex);
    if (maskPart.length < 2) {
        return input;
    }
    var mask = maskPart.length <= 2 ? '*' : (maskPart.length > 6 ? "****" : "**");
    var maskStart = Math.fround((maskPart.length - mask.length) / 2);
    return (maskPart.substr(0, maskStart) + mask + maskPart.substr(maskStart + mask.length)) + suffix;
}
export { maskInfo };
//# sourceMappingURL=text.js.map