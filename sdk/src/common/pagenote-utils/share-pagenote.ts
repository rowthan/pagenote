// 获取 pagenote 基本状态工具，是否屏蔽、是否开始工作标识

const BLOCK_KEY = 'blockpagenote';
const LOADED_KEY = 'pagenote'
const BLOCK_PAGES = /\.pagenote\.html$/;

// 检测在当前网页是否屏蔽了 pagenote
const checkBlocked = function ():boolean {
  const isBlocked = !!document.querySelector(`*[data-${BLOCK_KEY}]`);
  const isBlockPage = BLOCK_PAGES.test(window.location.href);
  return isBlocked || isBlockPage;
}

// 检测是否植入了 pagenote sdk
const checkLoaded = function ():boolean {
    return document.body.dataset[LOADED_KEY]==='1' || !!document.querySelector('pagenote-root')
}

// 标识已植入 SDK
const setLoaded = function () {
    document.body.dataset[LOADED_KEY] = '1'
}

// 标识已屏蔽 SDK
const setBlock = function ():void {
    document.body.dataset[BLOCK_KEY] = '1'
}

export {
    checkBlocked,
    checkLoaded,
    setBlock,
    setLoaded,
}