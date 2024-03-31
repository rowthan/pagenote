import { CodeBlock } from 'notion-types'
import * as React from 'react'
import { getBlockTitle } from 'notion-utils'
import { useNotionContext } from 'react-notion-x'
import dynamic from 'next/dynamic'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)

/**
 * 对 Notion 文档的扩展，对于 html 代码块，真正的转为 html 节点而不是 字符串 
 * 
*/
const HTML: React.FC<{
    block: CodeBlock
    defaultLanguage?: string
    className?: string
  }> = ({ block, defaultLanguage = 'typescript', className }) => {
    const { recordMap } = useNotionContext()
    const content = getBlockTitle(block, recordMap)
    const language = (
        block.properties?.language?.[0]?.[0] || defaultLanguage
      ).toLowerCase()
    return (
      <>
        {
          language === 'html' ?
          <div dangerouslySetInnerHTML={{__html: content}} className='contents'>
            
          </div>
          :
          <Code block={block}></Code>
        }
      </>
    )
  }


  
export default HTML;