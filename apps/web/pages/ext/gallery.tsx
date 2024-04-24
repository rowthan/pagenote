import { useState } from 'react'
import { SnapshotResource } from '@pagenote/shared/lib/@types/data'
import useTableQuery from 'hooks/table/useTableQuery'
import PhotoAlbum from 'react-photo-album'
import Head from 'next/head'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

// import optional lightbox plugins
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { basePath } from '../../const/env'
import { useRouter } from 'next/router'
import RedirectToExt from 'components/RedirectToExt'
import { Collection } from '../../const/collection'
import {Button} from "../../@/components/ui/button";
import {downloadBase64Images} from "../../utils/image";

const breakpoints = [3840, 2400, 1080,980,720, 640, 384, 256, 128, 96, 64, 48]
export default function Gallery() {
  const router = useRouter()
  const { data: images } = useTableQuery<SnapshotResource>(
    Collection.snapshot,
    {
      limit: 999,
      query: {
        pageKey: router.query.pageKey?.toString() || undefined,
      },
      sort: {
        createAt: -1,
      },
    }
  )

  const [index, setIndex] = useState(-1)

  const imageList = images.map(function (item) {
    // @ts-ignore
    const width = item.width || window.innerWidth
    // @ts-ignore
    const height = item.height || window.innerHeight
    let src = item.uri || item.url || '';
    // 缩略图样式
    if(src.startsWith('http')){
      const [url] = src.split('?');
      src = url + '?x-oss-process=style/thumb'
    }
    return {
      key: item.key,
      src: src,
      alt: item.alt,
      caption: '',
      width: width,
      height: height,
      srcSet: breakpoints.map((breakpoint) => {
        const setHeight = Math.round((height / width) * breakpoint)
        return {
          src: src,
          width: breakpoint,
          height: setHeight,
        }
      }),
    }
  })

  function onClickAlbum(index: number) {
    window.open(process.env.WEB_HOST+`/file/${imageList[index].key}.jpeg`)

    // window.open(`${basePath}/ext/img.html?id=${imageList[index].key}`)
  }

  function batchDownload() {
    downloadBase64Images(images)
  }

  return (
    <>
      <Head>
        <title>网页截图</title>
      </Head>
      <div className="bg-gray-200 p-4">
        <Button className={'hidden'} onClick={batchDownload}>批量下载</Button>
        <PhotoAlbum
            layout="rows"
            photos={imageList}
            onClick={({index}) => onClickAlbum(index)}
        />
        <Lightbox
            slides={imageList}
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            // enable optional lightbox plugins
            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        />
      </div>
    </>
  )
}

Gallery.defaultProps = {}
