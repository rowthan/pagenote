import { useState, type ReactNode, FormEvent } from 'react'
import { useRouter } from 'next/router'
import useGiftDetail from '../hooks/useGiftDetail'
import CardSvg from 'assets/svg/card.svg'
import useUserInfo from '../hooks/useUserInfo'
import { toast } from '../utils/toast'
import { getFormData } from 'utils/form'
import dayjs from 'dayjs'
import { demoGiftDetail, GiftDetail } from '../service/gift'
import { Button } from '../@/components/ui/button'
import { get } from 'lodash'
import classNames from 'classnames'
import BasicLayout from '../layouts/BasicLayout'

interface Props {
  children?: ReactNode
  gifts?: GiftDetail[]
}

enum ReceiveStatus {
  ing = 1,
  unset = 0,
}

type UserForm = { uid?: number; email?: string }

export async function getStaticProps() {
  const keys = Object.keys(demoGiftDetail).join(',');
  const gifts = [];
  try{
    const data = await fetch(
        `${process.env.API_HOST}/api/graph/book?query=query{gifts{${keys}}}`,
        {
          headers: {
            token: 'system_20231212',
          },
        }
    ).then(function (res) {
      return res.json()
    })
    gifts.push(...data?.data?.gifts || [])
  }catch (e) {
    console.warn('init gifts error')
  }
  return {
    props: {
      gifts: gifts || [],
    },
  }
}

export default function Gift(props: Props) {
  const router = useRouter()
  const giftId = router.query.giftId?.toString() || 'wechat_2'
  const { data, isLoading, receiveGift, mutate } = useGiftDetail(giftId || '')
  const [user] = useUserInfo()
  const [status, setStatus] = useState<ReceiveStatus>(ReceiveStatus.unset)

  const gift = data || props.gifts?.find((item) => item.giftId === giftId)
  const uid = user?.profile?.uid

  function submit(e: FormEvent<HTMLFormElement>) {
    e.stopPropagation()
    e.preventDefault()
    const value = getFormData<UserForm>(e.target as HTMLFormElement)
    setStatus(ReceiveStatus.ing)
    receiveGift(value)
      .then(function (res) {
        if (res?.success && res?.data?.gotGift?.received) {
          toast('领取成功🏅️')
        } else {
          toast(res?.error || '领取失败')
        }
      })
      .finally(function () {
        setStatus(ReceiveStatus.unset)
      })
  }

  const title =
    isLoading && !gift
      ? '正在拉取福利信息'
      : (gift ? gift.giftName : '') || '没有找到福利信息'
  let available = true
  const bg =
    gift?.image ||
    'https://pagenote-public.oss-cn-beijing.aliyuncs.com/_static/abstract-gift-card-1.png'
  let label = '领取'
  if (gift?.expiredAt) {
    if (dayjs(new Date(gift.expiredAt)).isBefore(new Date())) {
      label = '福利已过期，下次早点来'
      available = false
    }
  }
  if (gift?.received) {
    label = '已领取'
    available = false
  }


  const types = [
    {
      key: 'bookDays',
      label: '普通福利',
      unit: 'VIP',
    },
  ]
  if (gift?.paidDays) {
    types.push({
      key: 'paidDays',
      label: '赞助者福利',
      unit: 'VIP',
    })
  }
  if (gift?.score) {
    types.push({
      key: 'score',
      label: '终身用户福利',
      unit: '积分',
    })
  }

  const userKey = gift?.userGiftKey || 'bookDays'
  return (
    <BasicLayout nav={false}>
      <div className={'min-h-fill flex item-center flex-col'}>
        <div className="m-auto sm:max-w-[520px] max-w-[375px] min-w-[300px] p-5 rounded-[10px] shadow border border-slate-400 flex-col justify-start items-start gap-[30px]">
          <div className="flex-col justify-start items-start gap-[5px] flex">
            <div className=" justify-start items-center gap-1 inline-flex">
              <div className="text-sky-800 text-[28px] font-bold font-['Inter'] leading-10">
                {title}
              </div>
            </div>
            <div
              className=" text-sky-700 text-sm font-semibold font-['Inter'] uppercase leading-normal tracking-tight"
              dangerouslySetInnerHTML={{ __html: gift?.description || '' }}
            ></div>
          </div>
          <div className="flex-col justify-start items-start gap-[5px] flex mt-4">
            {types.map((type) => (
              <div
                key={type.key}
                className={classNames(
                  'w-full  justify-between items-center inline-flex text-sky-950 ',
                  {
                    'bg-yellow-400': type.key === userKey,
                    'bg-yellow-50 text-opacity-80': type.key !== userKey,
                  }
                )}
              >
                <div className=" px-[5px] py-2.5 justify-start items-center gap-[15px] flex">
                  <div className="justify-start items-center gap-2 flex">
                    <div className=" text-xs font-semibold font-['Inter'] leading-tight">
                      {type.key === userKey ? ' ✓ ' : ' × '} {type.label}
                      {type.key === userKey && uid ? '（你）' : ''}
                    </div>
                  </div>
                </div>
                <div className="pr-[5px] justify-center items-center flex text-sky-950">
                  {get(gift, type.key)} {type.unit}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-slate-400 text-xs font-medium font-['Inter'] leading-tight">
            {gift?.expiredAt && (
              <div>
                <span>领取有效期</span> -{' '}
                {dayjs(gift?.expiredAt).format('YYYY-MM-DD')}
              </div>
            )}
            <br />
            领取条件：
            <br />
            {gift?.qualificationDes}
          </div>

          <form
            onSubmit={submit}
            className="flex flex-col justify-center m-auto relative mt-4 z-10 gap-1"
          >
            <div className={'hidden'}>
              <input
                type="text"
                readOnly
                className="hidden"
                name="giftId"
                defaultValue={giftId}
              />
              <input
                type="text"
                readOnly
                className="hidden"
                name="uid"
                defaultValue={uid}
              />
            </div>

            {!uid && (
              <div>
                <input
                  type="email"
                  autoFocus
                  required
                  name="email"
                  className="w-full p-2 mb-1 rounded-sm border m-auto"
                  placeholder="福利接收邮箱地址"
                />
              </div>
            )}
            <Button
              disabled={!available}
              type={'submit'}
              loading={status === ReceiveStatus.ing}
            >
              <div className="text-sm ">{label}</div>
            </Button>
            {gift?.paidDays && userKey === 'bookDays' && (
              <Button type={'button'} variant={'link'}>
                <a className="text-sm text-muted-foreground" href={'/pricing'}>
                  成为赞助者后领取 {gift.paidDays} 日福利
                </a>
              </Button>
            )}
          </form>
        </div>
      </div>
    </BasicLayout>
  )
}
