import { useEffect, useState } from 'react'
import extApi from '@pagenote/shared/lib/pagenote-api'
import dayjs from 'dayjs'
import CheckVersion from '../check/CheckVersion'
import FeedbackForm from './FeedbackForm'
import Image from 'next/image'
import Link from 'next/link'

export interface FeedBackItem {
  title: string
  content: string
  reply: string
  feedbackId: string
  createAt: number
}

export default function FeedbackList() {
  const [feedbackList, setList] = useState<FeedBackItem[]>([])
  const [feedbackDetail, setDetail] = useState<FeedBackItem | null>(null)

  useEffect(function () {
    loadFeebackList()
  }, [])

  function loadFeebackList() {
    extApi.network
      .pagenote({
        url: '/api/graph/user',
        method: 'GET',
        data: {
          query: `query{listFeedback{feedbackId,title,content,reply,createAt}}`,
        },
      })
      .then(function (res) {
        if (res?.data?.json?.success) {
          console.log('list', res)
          setList(res.data.json?.data?.listFeedback)
        }
      })
  }

  return (
    <CheckVersion requireVersion="0.24.0">
      <div>
        <FeedbackForm onSubmit={loadFeebackList} />
        <div>
          {feedbackList.map(function (item) {
            const level = item.reply ? '' : 'warning'
            return (
              <span
                key={item.feedbackId}
                className="tooltip"
                data-tip={item.title}
              >
                <button
                  onClick={() => {
                    setDetail(item)
                  }}
                  className={`badge badge-${level} badge-outline m-1 text-xs `}
                >
                  {item.feedbackId}
                </button>
              </span>
            )
          })}

          {feedbackDetail && (
            <div
              className={`modal modal-${feedbackDetail ? 'open' : 'onClose'}`}
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">
                  反馈详情:{feedbackDetail?.feedbackId}
                </h3>
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <Image
                        alt=""
                        src="https://pagenote.cn/favicon.ico"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {feedbackDetail?.title}
                    <time className="text-xs opacity-50 ml-2">
                      {dayjs(feedbackDetail?.createAt).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )}
                    </time>
                  </div>
                  <div className="chat-bubble">{feedbackDetail?.content}</div>
                  <div className="chat-footer opacity-50">已送达</div>
                </div>
                {feedbackDetail?.reply && (
                  <div className="chat chat-end">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <Image
                          alt={''}
                          src="https://pagenote.cn/favicon.ico"
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                    <div className="chat-header">
                      开发者
                      {/*<time className="text-xs opacity-50">12:46</time>*/}
                    </div>
                    <div className="chat-bubble">
                      {feedbackDetail?.reply || '~'}
                    </div>
                    <div className="chat-footer opacity-50">
                      {feedbackDetail?.reply ? '' : '还未回复'}
                    </div>
                  </div>
                )}

                <div className="modal-action">
                  <button className="btn" onClick={() => setDetail(null)}>
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={'absolute right-2 bottom-2'}>
          <Link className={'link link-primary text-sm'} href="/question">
            常见问题》
          </Link>
        </div>
      </div>
    </CheckVersion>
  )
}
