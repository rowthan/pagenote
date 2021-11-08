## 此目录下的文件
common 下为一些无依赖的工具、声明文件。供其他项目公用使用，如管理页、插件系统复用的文件。
甚至可以用于与 PAGENOTE 无关的项目，如 toast 方法等。

这类产物最终会被打包至 sdk/lib 文件夹下。
使用方式如下：
```javascript
import toast from 'pagenote/lib/toast'
```