
const BLOCK_KEY = 'blockpagenote';
const BLOCK_PAGES = /\.pagenote\.html$/;

const checkBlocked = function ():boolean {
  const isBlocked = !!document.querySelector(`*[data-${BLOCK_KEY}]`);
  const isBlockPage = BLOCK_PAGES.test(window.location.href);
  return isBlocked || isBlockPage;
}

const checkLoaded = function ():boolean {
    return !!document.querySelector('pagenote-root')
}

const setBlock = function ():void {
    document.body.dataset[BLOCK_KEY] = '1'
}

export {
    checkBlocked,
    checkLoaded,
    setBlock,
}