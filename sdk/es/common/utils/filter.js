var getDomain = function (url) {
    var match = url.match(/:\/\/(.*?)\//);
    var domainKey = match ? match[1] : url;
    if (domainKey) {
        domainKey = domainKey.replace(/^www\./, '');
    }
    return domainKey;
};
export { getDomain };
//# sourceMappingURL=filter.js.map