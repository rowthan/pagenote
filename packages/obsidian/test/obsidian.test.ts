import Obsidian from '../src/index';

global.fetch = require('node-fetch');
global.FormData = require('form-data');
// global.File = require('fs');
const fs = require('fs');
// const mock = require('mock-fs');

// 读取指定文件夹的文件
function readFilesFromFolder(folderPath:string) {
  return fs.readdirSync(folderPath);
}

const obsidian = new Obsidian({
  token: 'b6a2199915a82fcb347137c3c2b51c9f3bff635e094d75def9f97b744557c9c1',
  host: 'http://127.0.0.1:27123',
});

describe('Obsidian connect', () => {
  it('should connect to the obsidian', async () => {
    const status = await obsidian._status();
    expect(status?.authenticated).toBe(true);
  });

  it('should un-connect to the obsidian', async () => {
    const unAuthObsidian = new Obsidian({
      token: 'xxxx',
      host: 'http://127.0.0.1:27123',
    });
    const status = await unAuthObsidian._status();
    expect(status?.authenticated).toBe(false);
  });

})

// 测试用例
describe('Content Upload Test', () => {
  it('should upload content string to the obsidian', async () => {
    const content = '以字符串上传';
    const file = './_test_/test_string.md';
    const response = await obsidian.putFile(file,
        content);
    expect(response.errorCode).toBe(undefined);

    const result = await obsidian.getFile(file)
    if(result?.errorCode){
      console.error(result.message);
    }
    expect(result?.errorCode).toBe(undefined);
    expect(result?.content).toBe(content);


    const listResult = await obsidian.listFiles()

    expect(listResult.errorCode).toBe(undefined);
    expect(listResult.files.length).toBeGreaterThan(1);
  });
});



// 测试用例
// describe('File Upload Test', () => {
//   const folderPath = path.resolve(__dirname, './files');
//   // const files = readFilesFromFolder(folderPath);
//
//   // mock({
//   //   '/tmp': mock.load(folderPath, {recursive: false, lazy:false}),
//   // });
//   mock({
//     'test.txt': 'content here by mock',
//     'files/test.png': mock.load(path.resolve(__dirname, './files/test.png'), {recursive: false, lazy:false}),
//   })
//
//   jest.mock('fs', () => ({
//     readFileSync: jest.fn().mockImplementation((path) => {
//       return mock.readFileSync(path);
//     })
//   }));
//
//   // const realFilePath = './files/test.png';
//   // console.log('read data',realFilePath)
//   // const myData = mock.bypass(() => fs.readFileSync(realFilePath));
//   // console.log('data::',myData)
//
//   const myData = mock.readFileSync('test.text');
//
//   it('should upload files to the obsidian', async () => {
//     const fileObject = new File([myData], 'test.png',{
//       type: 'image/png',
//     });
//     const response = await obsidian.putFile('__test__/test.png', fileObject);
//     console.log('response. message',response)
//     expect(response.errorCode).toBe(0);
//   });
// });
