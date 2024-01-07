export * from './util'
interface CommonResponse {
  errorCode?: number,
  message?: string,
}
export interface FilesResponse extends CommonResponse{
  files: string[]
}

export interface FileResponse extends CommonResponse{
  "tags": string[],
  "frontmatter": {},
  "stat": {
    "ctime": number,
    "mtime": number,
    "size": number
  },
  "path": string,
  "content": string
}

export enum AcceptType {
  markdown = 'text/markdown',
  text = 'text/*',
  json = 'application/vnd.olrapi.note+json',
  jpeg = 'image/jpeg',
  any = '*/*'
}

export enum ContentType {
  markdown = 'text/markdown',
  text = 'text/*',
  json = 'application/json',
  any = '*/*',
  stream = 'application/octet-stream',
  formData = 'multipart/form-data',
}

class Obsidian {
  private readonly token: string;
  private readonly host: string;
  public status: {
    authenticated?: boolean,
    service?: string,
    status?: string,
    versions?:{
      obsidian: string,
      self: string
    },
    error?: string
  } = {}

  constructor(props: { token: string, host?: string }) {
    this.token = props.token;
    this.host = props.host || 'http://127.0.0.1:27123';
    this._status().then(r => {});
  }

  _fetch(path: string, params:{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers?: {
      Accept:  AcceptType,
      'Content-Type'?: ContentType,
    },
    body?: any,
  }){
    return fetch(this.host + path,{
      method: params.method,
      // @ts-ignore
      headers: {
        ...(params.headers || {}),
        'Authorization': `Bearer ${this.token}`,
      },
      body: params.body,
    })
  }

  /**写、创建文件*/
  putFile(file: string,body:string | Blob):Promise<CommonResponse>{
    const isPlainText = typeof body ==='string';
    let formData = new FormData();
    if(!isPlainText){
      formData.append('file',body,file);
    }

    return this._fetch('/vault/'+file,{
      method: 'PUT',
      body: isPlainText ? body : formData,
      headers:{
        Accept: AcceptType.json,
      }
    }).then(function (res) {
      // 保存成功，状态码为 204
      if(res.status !== 204){
        return res.json()
      }
      return {
        errorCode: undefined,
      }
    })
  }

  /**
   * 获取文件
   * */
  getFile(file: string): Promise<FileResponse | null>{
    return this._fetch('/vault/'+file,{
      method: 'GET',
      headers:{
        Accept: AcceptType.json,
        'Content-Type': ContentType.json,
      }
    }).then(function (res) {
      return res.json();
    })
  }

  getFileBlob(file: string): Promise<Blob | null>{
    return this._fetch('/vault/'+file,{
      method: 'GET',
      headers:{
        Accept: AcceptType.json,
      },
    }).then(async function (res) {
      if(res.status === 200){
        return res.blob()
      }
      return null;
    })
  }

  listFiles(dir: string = ''):Promise<FilesResponse>{
    return this._fetch('/vault/'+dir,{
      method: 'GET',
      headers:{
        Accept: AcceptType.json,
      },
    }).then(function (res) {
      return res.json();
    })
  }

  _status(){
    return this._fetch('/',{
      method: 'GET',
      headers:{
        Accept: AcceptType.json,
      },
    }).then(async (res)=> {
       this.status = await res.json() || {};
       this.status.error = this.status?.authenticated ? '' : 'unauthenticated, check the token please'
       return this.status
    }).catch( (reason)=> {
       this.status.error = reason.message || ''
        return this.status
    })
  }


  appendFile(file: string,data:{
    data: string | any
  }){
    return this._fetch('/vault/'+file,{
      method: 'POST',
      body: data.data,
      headers:{
        Accept: AcceptType.markdown,
      }
    })
  }

  deleteFile(file: string){
    return this._fetch('/vault/'+file,{
      method: 'DELETE',
      headers:{
        Accept: AcceptType.json,
      }
    })
  }
}

export {
  Obsidian
}

export default Obsidian
