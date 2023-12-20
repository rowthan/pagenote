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

export default class Obsidian {
  private readonly token: string;
  private readonly host: string;

  constructor(props: { token: string, host: string }) {
    this.token = props.token;
    this.host = props.host;
  }

  _fetch<T>(path: string, params:{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers: {
      Accept:  AcceptType,
      'Content-Type'?: ContentType,
    },
    body?: any,
  }){
    return fetch(this.host + path,{
      method: params.method,
      // @ts-ignore
      headers: {
        ...params.headers,
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

    return this._fetch<CommonResponse>('/vault/'+file,{
      method: 'PUT',
      body: isPlainText ? body : formData,
      headers:{
        Accept: AcceptType.json,
        // 'Content-Type': isPlainText ? ContentType.markdown : ContentType.formData,
      }
    }).then(async function (res) {
      if(res.status === 204){
        return{
        }
      }else{
        return await res.json();
      }
    })
  }

  /**
   * 获取文件
   * */
  getFile(file: string): Promise<FileResponse>{
    return this._fetch<FileResponse>('/vault/'+file,{
      method: 'GET',
      headers:{
        Accept: AcceptType.json,
      }
    }).then(async function (res) {
      return await res.json();
    })
  }


  listFiles(dir: string = ''):Promise<FilesResponse>{
    return this._fetch<FilesResponse>('/vault/'+dir,{
      method: 'GET',
      headers:{
        Accept: AcceptType.json,
      },
    }).then(function (res) {
      return res.json();
    })
  }




  appendFile(file: string,data:{
    data: string | any
  }){
    return this._fetch<CommonResponse>('/vault/'+file,{
      method: 'POST',
      body: data.data,
      headers:{
        Accept: AcceptType.markdown,
      }
    })
  }

  deleteFile(file: string){
    return this._fetch<CommonResponse>('/vault/'+file,{
      method: 'DELETE',
      headers:{
        Accept: AcceptType.json,
      }
    })
  }
}
