import { Block } from 'notion-types'
import { get } from 'lodash'

// 这是一个 hack 方法，从返回的对象中 找到 path 属性
export function getPathFromProperties(block?: Block) {
  if (!block) {
    return
  }
  //  要求该属性的类型为 URL 才能被正确解析读取
  for (let i in block.properties) {
    const prop = block.properties[i]
    const plainText = get(prop, '0.0')
    const tag = get(prop, '0.1.0.0')
    const value = get(prop, '0.1.0.1')
    // 无法从确定的属性值中获取，所以hack一下，遍历所有属性，进行判断后作为 path 来使用，可能存在误差。需要保证属性中只有一个URL类型的字段，否则可能导致异常
    if (plainText === value && tag === 'a') {
      return plainText[0] === '/' ? plainText : '/' + plainText
    }
  }
}

export function highlightTarget(hashId: string){
  const target = document.getElementById(hashId.replace("#",""));
  console.log('hash id',hashId,target)
  const element = target?.parentElement?.parentElement || target;

  if(!element){
    return;
  }



  element.scrollIntoView({
    behavior: "smooth",
  })

  const className = 'highlight-hash'
  element.classList.add(className);
  setTimeout(function(){
    element.classList.remove(className)
  },4000)
}