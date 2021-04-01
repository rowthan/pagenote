## pagenote
让笔记留在网页里、划词高亮、摘选、复制。。。。。。 
 
## 应用场景
* [Firefox 插件](https://addons.mozilla.org/zh-CN/firefox/addon/page-note/)  
* [Chrome插件](https://chrome.google.com/webstore/detail/pagenotehighlight-and-tak/hpekbddiphlmlfjebppjhemobaopekmp?utm_source=github)  
* [Edge插件](https://microsoftedge.microsoft.com/addons/detail/pagenote-%E4%B8%80%E9%A1%B5%E4%B8%80%E8%AE%B0/ablhdlecfphodoohfacojdngdfkgneaa)  
* [360插件](https://ext.chrome.360.cn/webstore/detail/gielpddfollkffnbiegekliodnahhpfa)

## 开发者使用
```shell script
npm install pagenote --save
import Pagenote from 'pagenote';
import 'pagenote/dist/pagenote.css';
var pagenote = new Pagenote('demo',option);
pagenote.init();
```

## TODO LIST
* TypeScript 重构项目 分支： typescript
* 弃用 Preact 重新使用 svelte

## 相关推荐
* [typescript 手册](https://www.tslang.cn/docs/handbook)
