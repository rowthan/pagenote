import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import dayjs from 'dayjs'
import path from 'path';

function readDirectoryRecursive(directoryPath: string) {
  const files = fs.readdirSync(directoryPath)
  console.log(files, directoryPath)

  const fileList: string[] = [];
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // 如果是子目录，则递归读取子目录
      const subPaths = readDirectoryRecursive(filePath);
      fileList.push(...subPaths);
    } else {
      // 如果是文件，则进行相应的操作
      fileList.push(filePath);
      // 这里可以对文件进行处理，例如读取文件内容等
    }
  });

  return fileList;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const files = readDirectoryRecursive(path.join(process.cwd(), '.cache'))
  let urlList = ''
  files.forEach(function (item) {
    const path = item
      .replace(process.cwd(), '')
      .replace('.cache/', '')
      .replace('.json', '')

    urlList += `
        <url>
            <loc>https://pagenote.cn${path}</loc>
            <priority>1</priority>
            <lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod>
            <changefreq>daily</changefreq>
        </url> `
  })


  const map = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlList}
  </urlset>`

  // if(process.env.NODE_ENV === 'development'){
  //   fs.writeFileSync('public/maps/docs.xml',map)
  // }

  return res.status(200).send(map)
}
