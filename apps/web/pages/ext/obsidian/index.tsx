import React, {useEffect} from 'react'
import RedirectToExt from 'components/RedirectToExt'
import useWhoAmi from 'hooks/useWhoAmi';
import {Note, SnapshotResource} from '@pagenote/shared/lib/@types/data';
import useTableQuery from 'hooks/table/useTableQuery';
import {Collection} from 'const/collection';
import Handlebars from 'handlebars'
import SyncSettingToObsidian from 'components/obsidian/SyncSetting';
import obsidian from 'utils/obsidian';
import {FilesResponse} from "@pagenote/obsidian";


function base64ToFile(base64:string, fileName: string) {
  // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
  let data = base64.split(',') || [];
  // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
  //@ts-ignore
  let type = data[0].match(/:(.*?);/)[1];
  // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
  let suffix = type.split('/')[1];
  // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
  const bstr = window.atob(data[1]);
  // 获取解码结果字符串的长度
  let n = bstr.length
  // 根据解码结果字符串的长度创建一个等长的整形数字数组
  // 但在创建时 所有元素初始值都为 0
  const u8arr = new Uint8Array(n)
  // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
  while (n--) {
    // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
    u8arr[n] = bstr.charCodeAt(n)
  }
  // 利用构造函数创建File文件对象
  // new File(bits, name, options)
  const file =  new File([u8arr], `${fileName}.${suffix}`, {
    type: type
  })
  // 将File文件对象返回给方法的调用者
  return file;
}

async function downloadUrlImage(url: string){
  return fetch(url).then(function(res){
    return res.blob();
  }).catch(function(e){
    return null;
  })
}

function isBase64(url: string = ''){
  try{
    return url.toString().startsWith('base64')
  }catch(e){
    console.error(e)
  }
}



export default function Data() {
  const [whoAmI] = useWhoAmi();
  const { data: images } = useTableQuery<SnapshotResource>(
    Collection.snapshot,
    {
      limit: 99,
      query: {
      },
      sort: {
        createAt: -1,
      },
    }
  )

  const { data: notes } = useTableQuery<Note>(
    Collection.note,
    {
      limit: 99,
      query: {
      },
      sort: {
        createAt: -1,
      },
    }
  )

  useEffect(function(){
    if(notes.length){
      notes.forEach(function(note){
        const content = note.html;
        const path = 'pagenote/memo/'+note.key+'.md'
        obsidian.putFile(path,content || 'no content')
      })

      obsidian.listFiles('pagenote/memo/').then(function(res: FilesResponse){
        const defaultTemplate = `{{#files}}![[{{this}}]]  
---
        {{/files}}
        `
        const templateObject = Handlebars.compile(defaultTemplate)

        let content = templateObject(res)
        console.log(content)
        obsidian.putFile('pagenote/memo.home.md',content)
      })
    }
  },[notes])

  useEffect(()=>{
    return;
    if(!images.length){
      return;
    }
    images.forEach(async function(image){
      const {url='',uri,key} = image;
      const filename = image.key + '.jpeg'
      const path = 'pagenote/image/snapshot/'+filename

      const result = await obsidian.getFileBlob(path)
      if(result){
        // const blobUrl = URL.createObjectURL(result);
        // console.log(result)
      }else{
        const buffer = isBase64(url || '') ? base64ToFile(url,filename) : null //await downloadUrlImage(url)
        if(buffer){
          obsidian.putFile(path,new Blob([buffer]))
        }
      }
    })
  },[images])

  function fetchFiles(){
    console.log('请求 obsidian')

    // obsidian.putFile('pagenote/image/snapshot',`${JSON.stringify(whoAmI)}`).then(function(res){
    //     console.log('put result',res)

    // })


    obsidian.listFiles('pagenote/image/snapshot/').then(async function(res){
      const template = await obsidian.getFile('pagenote/image/index.template.md');
      const defaultTemplate = '{{#files}}![[{{this}}]]{{/files}}'
      console.log(template,defaultTemplate)
      const templateObject = Handlebars.compile(template?.content || defaultTemplate)
      let content = templateObject(res)
      console.log(content)
      obsidian.putFile('pagenote/image/index.md',content)
    })


  }

  useEffect(() => {
    fetchFiles();
  }, [])
  return (
    <RedirectToExt>
      <div>obsidian

      <SyncSettingToObsidian />
      </div>
    </RedirectToExt>
  )
}
