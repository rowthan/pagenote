// 获取 pagenote 基本状态工具，是否屏蔽、是否开始工作标识
var BLOCK_KEY = 'blockpagenote';
var LOADED_KEY = 'pagenote';
var BLOCK_PAGES = /\.pagenote\.html$/;
// 检测在当前网页是否屏蔽了 pagenote
var checkBlocked = function () {
    var isBlocked = !!document.querySelector("*[data-" + BLOCK_KEY + "]");
    var isBlockPage = BLOCK_PAGES.test(window.location.href);
    return isBlocked || isBlockPage;
};
// 检测是否植入了 pagenote sdk
var checkLoaded = function () {
    return document.body.dataset[LOADED_KEY] === '1' || !!document.querySelector('pagenote-root');
};
// 标识已植入 SDK
var setLoaded = function () {
    document.body.dataset[LOADED_KEY] = '1';
};
// 标识已屏蔽 SDK
var setBlock = function () {
    document.body.dataset[BLOCK_KEY] = '1';
};
export { checkBlocked, checkLoaded, setBlock, setLoaded, };
//# sourceMappingURL=share-pagenote.js.map