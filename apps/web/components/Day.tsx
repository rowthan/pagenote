import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useEffect, useState } from 'react'

dayjs.extend(updateLocale)
dayjs.locale('zh-cn')
dayjs.updateLocale('zh-cn', {
  weekdays: [
    '星期天',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ],
})

export default function Day() {
  const [today, setToday] = useState<Date>()
  dayjs.locale('zh-cn')

  useEffect(function () {
    setToday(new Date())
    dayjs.locale('zh-cn')
  }, [])

  if (!today) {
    return null
  }

  return (
    <div className="min-w-32 bg-white min-h-48  mb-4 font-medium">
      <div className="w-32 flex-none rounded-t lg:rounded-t-none lg:rounded-l text-center shadow-lg ">
        <div className="block rounded-t overflow-hidden  text-center ">
          <div className="bg-blue-500 text-white py-1">
            {dayjs(today).format('M')}月
          </div>
          <div className="pt-1 border-l border-r border-white bg-white text-gray-950">
            <span className="text-5xl font-bold leading-tight">
              {dayjs(today).format('D')}
            </span>
          </div>
          <div className="border-l border-r border-b rounded-b-lg text-center border-white bg-white ">
            <span className="text-sm text-gray-600">
              {dayjs().locale('zh-cn').format('dddd')}
            </span>
          </div>
          {/*<div className="pb-2 border-l border-r border-b rounded-b-lg text-center border-white bg-white">*/}
          {/*  <span className="text-xs leading-normal">*/}
          {/*    8:00 am to 5:00 pm*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  )
}
