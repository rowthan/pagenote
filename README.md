# pagenote
让网页分享更方便，明确你想分享的目标。 9.6kb(gzip), [firefox 插件体验](https://addons.mozilla.org/zh-CN/firefox/addon/page-note/)、[Chrome插件](https://chrome.google.com/webstore/detail/dohbgjmflacneejmpdieincbbokoflgm/)


## 使用
```shell script
npm install pagenote --save
import PageNote from 'pagenote';
var pagenote = new PageNote('demo',option);
pagenote.init();
```

## 参数option

|  属性   |  默认值 | 备注 |
|  ----  | ----  | ---- |
| initType  | 'default' | 初始化点亮方式：`default` 默认恢复上次，`light`点亮所有标记，`off`关闭所有标记|
| dura  | 100 | 点亮速度 |
| saveInURL| false | 将数据存储到URL中|
| maxMarkNumber | 30 | 每个页面最多标记的个数 |
| blacklist| [] | 不可标记的DOM 标识符，如 `['.class','body','#id',]`|


## API
* Pagenote.init(data)

初始化EasyShare，开始工作


* Pagenote.addListener(fun)

增加状态status值监听器，当状态值发生变化将调用该方法

* Pagenote.record(targetInfo)

增加记录节点信息。targetInfo可选


* Pagenote.remove(index)

删除第index个节点

* Pagenote.replay(index,goto,hightlight,autoNext)

播放/高亮节点信息

## TODO LIST
* 精简压缩至 15kb以内
* 服务器存储
* 样式调整统一化 任何网站样式展示一致 done
* 埋点
* 系统通知功能
* 移动端moving
* 可调颜色、标注 done
* 记录高亮的锚点位置
* tag 位置记录为相对位置（偏移量），用于响应式布局
* 点亮方式：滚动到此并停留10s自动点亮。
* print模式下不可见
* 一键导出 MD\image
* 插件新标签页覆盖
* 快捷键 done
* 设置页 done
"chrome_url_overrides" : {
      "newtab": "option.html"
    },