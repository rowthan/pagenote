import Modal from 'components/Modal'
import React, { ReactElement, useRef, useState } from 'react'
import ImageShape from './ImageShape'
import { getPublicUploadClient } from '../../utils/upload'
import md5 from 'md5'
import { ContentType } from '@pagenote/shared/lib/@types/data'
import { toast } from '../../utils/toast'

export default function UploadTrigger(props: {
  onChange: (imgSrc: string) => void
  children: ReactElement
}) {
  const { onChange, children } = props
  const [showModal, setModal] = useState(false)
  const [uploadFileImg, setUploadFileImg] = useState('')
  const [uploading, setUploading] = useState(false)

  const canvas = useRef<HTMLCanvasElement>()

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setUploadFileImg(reader.result?.toString() || '')
      )
      // @ts-ignore
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onCropFinished() {
    setUploading(true)
    getPublicUploadClient().then(function ({ client, cloud_space }) {
      if (!cloud_space || !client) {
        toast('上传失败，请重试')
        return
      }
      canvas.current?.toBlob(
        function (blob) {
          if (!blob) {
            return
          }
          const fileName = md5(`${Date.now()}`) + '.jpeg'
          client
            .put(
              `${cloud_space}/${fileName}`,
              new Blob([blob], { type: ContentType.jpeg })
            )
            .then((res) => {
              console.log(res.url, '上传结果')
              if (!res.url) {
                toast('上传失败，请重试')
                return
              }
              const url = res.url.replace(/^http:/, 'https:')
              onChange(url)
            })
            .catch(function () {})
            .finally(() => {
              setUploading(false)
              setModal(false)
            })
        },
        ContentType.jpeg,
        0.1
      )
    })
    canvas.current?.toBlob(function (res) {})
  }

  return (
    <div className="">
      <div
        onClick={() => {
          setModal(true)
        }}
      >
        {children}
      </div>
      <Modal keepNode={false} open={showModal} toggleOpen={setModal}>
        <div>
          <label>
            <div className={'btn btn-outline btn-sm my-4'}>
              {uploadFileImg ? '替换图片' : '选择图片'}
            </div>
            <input
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
            />
            {/*<button>上传图片</button>*/}
          </label>
          {uploadFileImg && (
            <ImageShape
              key={uploadFileImg}
              cropCallback={(element) => {
                canvas.current = element
              }}
              originImgSrc={uploadFileImg || ''}
            >
              <div className={'text-right my-2'}>
                <button
                  disabled={uploading}
                  className={`btn btn-sm ${uploading ? 'loading' : ''}`}
                  onClick={onCropFinished}
                >
                  确定
                </button>
              </div>
            </ImageShape>
          )}
        </div>
      </Modal>
    </div>
  )
}
