var BLOCK_KEY = 'blockpagenote';
var BLOCK_PAGES = /\.pagenote\.html$/;
var checkBlocked = function () {
    var isBlocked = !!document.querySelector("*[data-" + BLOCK_KEY + "]");
    var isBlockPage = BLOCK_PAGES.test(window.location.href);
    return isBlocked || isBlockPage;
};
var checkLoaded = function () {
    return !!document.querySelector('pagenote-root');
};
var setBlock = function () {
    document.body.dataset[BLOCK_KEY] = '1';
};
export { checkBlocked, checkLoaded, setBlock, };
//# sourceMappingURL=block-pagenote.js.map