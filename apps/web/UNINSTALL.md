# `/uninstall` 接入说明

## 发布配置

在部署环境中配置：

```dotenv
NEXT_PUBLIC_TALLY_UNINSTALL_FORM_ID=eqlypQ
```

当前 Tally 问卷已发布在 `https://tally.so/r/eqlypQ`。页面内置该公开表单 ID
作为默认值，部署环境变量可以覆盖它。

Tally 当前使用隐藏字段 `anonymous_install_id`。页面会把 fragment 中所有合法
键值原样传给 Tally；以后增加字段时，只需在插件 URL 与 Tally 隐藏字段中使用
相同名称，不需要修改或重新部署网页。

## 重新安装路由

卸载页只引导到 Edge 和 Chrome：

- Edge 上下文或 Edge 浏览器直接打开 Edge Add-ons。
- Chrome、Firefox、360 和未知浏览器统一使用 Chrome 安装路径，不再引流到
  Firefox Add-ons 或 360 扩展商店。
- 点击 Chrome 安装按钮时，页面会以不带凭据和来源信息的请求探测 Chrome Web
  Store，2.5 秒内不可达则改为打开 `/download`。

## 插件侧协议

插件只需要生成并保存一个随机 ID，卸载地址格式为：

```text
https://pagenote.cn/uninstall#anonymous_install_id=<anonymous_install_id>
```

插件首次安装时生成 ID，并调用浏览器 API 设置卸载地址：

```ts
const stored = await chrome.storage.local.get('anonymous_install_id')
const anonymous_install_id = stored.anonymous_install_id || crypto.randomUUID()

await chrome.storage.local.set({ anonymous_install_id })
chrome.runtime.setUninstallURL(
  `https://pagenote.cn/uninstall#anonymous_install_id=${encodeURIComponent(
    anonymous_install_id
  )}`
)
```

如果以后需要增加参数，可以继续使用 query 风格的 `&key=value`，不需要 JSON：

```text
https://pagenote.cn/uninstall#anonymous_install_id=xxx&browser=edge&extensionVersion=0.30.0
```

页面通过 `URLSearchParams` 解析并清理 fragment。`#` 后面的内容不会随 HTTP
请求发送，因此不会进入 CDN 或服务器访问日志。合法参数会保持原名称并全部
传给 Tally，不做字段映射、白名单或业务校验。页面自身的 Tally 嵌入参数会在
最后写入，避免使用方意外覆盖问卷展示配置。

插件不得加入账号 UID、邮箱、笔记内容、网页地址或其他敏感信息。

页面只接受上述 query 风格的 fragment 参数，不兼容查询参数、`#install=` 或
Base64 JSON 格式。

## 上线检查

1. 先部署并确认 `/uninstall` 能访问。
2. 提交一份测试问卷，检查全部隐藏字段进入 Tally。
3. 确认 Vercel Analytics 中的 URL 不含查询参数或 fragment。
4. 最后发布调用 `setUninstallURL` 的插件版本。
