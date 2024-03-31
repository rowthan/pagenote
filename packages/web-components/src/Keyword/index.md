# Keyword

This is an example component.

```jsx
import { Keyword } from '@pagenote/web-component';
import '@pagenote/web-component/index.wc.ts'
export default () => <div>
    <Keyword>微信公众号</Keyword>
    <Keyword>微信公众号</Keyword>

    <key-word>微信公众号</key-word>
  </div>
```

```javascript
const a = document.createElement('div');
a.innerHTML = '<key-word>key</key-word>'
document.body.append(a)
```
