import React from 'react'
import AuthList from './AuthList'
import Day from '../Day'
import TodayRelated from './TodayRelated'
import UserCard from './UserCard'

export default function Profile() {
  return (
    <div className="container mx-auto p-5">
      <div className="md:flex no-wrap md:-mx-2 gap-6">
        <div className="w-full md:w-3/12 ">
          <UserCard editable={true} />

          <div className="my-4 ">
            <AuthList />
          </div>
        </div>

        <div className="w-full md:w-9/12 min-h-64">
          <div className="flex bg-white text-gray-900 p-3 shadow-sm rounded-sm min-h-16">
            <Day />
            <div className={'ml-2'}>
              <h2>今日相关</h2>
              <TodayRelated />
              <div>
                <a className={'link'} href="https://pagenote.cn/pagenote">
                  查看所有
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
