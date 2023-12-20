import Obsidian, {AcceptType} from '../src/index';
import * as path from "path";

global.fetch = require('node-fetch');
global.FormData = require('form-data');
// global.File = require('fs');
const fs = require('fs');
import {Blob} from 'buffer';

// 读取指定文件夹的文件
function readFilesFromFolder(folderPath:string) {
  return fs.readdirSync(folderPath);
}

const obsidian = new Obsidian({
  token: 'b6a2199915a82fcb347137c3c2b51c9f3bff635e094d75def9f97b744557c9c1',
  host: 'http://127.0.0.1:27123',
});


// 测试用例
describe('Content Upload Test', () => {
  it('should upload content string to the obsidian', async () => {
    const content = '以字符串上传';
    const file = './_test_/test_string.md';
    const response = await obsidian.putFile(file,
        content);
    expect(response.errorCode).toBe(undefined);

    const result = await obsidian.getFile(file)
    expect(result.errorCode).toBe(undefined);
    expect(result.content).toBe(content);


    const listResult = await obsidian.listFiles()

    expect(listResult.errorCode).toBe(undefined);
    expect(listResult.files.length).toBeGreaterThan(1);
  });
});



// 测试用例
// describe('File Upload Test', () => {
//   const folderPath = path.resolve(__dirname, './files');
//
//   it('should upload files to the obsidian', async () => {
//     const files = readFilesFromFolder(folderPath);
//     for (const file of files) {
//       const filePath = `_test_/${file}`;
//
//       const data = fs.readFileSync(folderPath+'/'+file,);
//       // const blob = new Blob([data], {type: 'image/png'});
//
//       // const fileObject = new File([data], file);
//       const response = await obsidian.putFile(filePath, data);
//       console.log(response.message)
//       expect(response.errorCode).toBe(0);
//     }
//   });
// });

// describe('file test', () => {
//
//
//   it('put a markdown file success', async () => {
//     const result = await obsidian.putFile('brain/test.md',{
//       data: `## test from sdk \n create at ${new Date().toLocaleString()}`
//     })
//     expect(result.errorCode).toEqual(0);
//   });
//
//   it('put a markdown file fail without dir exists', async () => {
//     const result = await obsidian.putFile(`test/test2.md`,{
//       data: `文件夹与文件同名时，应该报错。已经存在 名为 test 的文件`
//     })
//     console.log(result.message)
//     expect(result.errorCode).toEqual(50000);
//   });
//
//   it('put a png file', async () => {
//     const result = await obsidian.putFile('test2.png',{
//       data: {
//         object: 1
//       }
//     })
//     expect(result.errorCode).toEqual(0);
//   });
//
//
//   it('put a html file', async () => {
//     const result = await obsidian.putFile('test3.json',{
//       data: `
//         <html lang="en">
//           <head>
//             <title>test</title>
//             <style>
//               h1 {
//                   color: red;
//                 }
//             </style>
//           </head>
//           <body>
//             <h1>test</h1>
//           </body>
//         </html>
//       `
//     })
//     expect(result.errorCode).toEqual(0);
//   });
//
//
//   it('put a json file', async () => {
//     const result = await obsidian.putFile('test.json',{
//       data: {
//         test: 1
//       }
//     })
//     expect(result.errorCode).toEqual(0);
//   });
// });
