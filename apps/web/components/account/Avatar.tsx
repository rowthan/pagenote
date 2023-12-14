import React, { useState } from 'react'
import UploadTrigger from '../image/UploadTrigger'
import useUserInfo, { fetchUserInfo } from '../../hooks/useUserInfo'
import { updateProfile, UpdateProfile } from '../../service'
import { toast } from 'utils/toast'
import { IMAGE_STYLE } from 'const/image'

export default function Avatar() {
  const [user, refresh] = useUserInfo()
  const { profile } = user || {}
  const img = profile?.avatar
  const [newImg, setNewImg] = useState(img)

  function onChange(updateInfo: UpdateProfile) {
    updateProfile(updateInfo).then(function (res) {
      if (updateInfo.avatar) {
        setNewImg(newImg)
      }
      if (res?.error) {
        toast(res?.error)
      } else {
        fetchUserInfo(true).then(function (res) {
          console.log('refresh force', res)
          refresh()
        })
      }
    })
    fetchUserInfo(true)
  }

  return (
    <div className="relative group overflow-hidden w-full h-full">
      <img
        className="w-full h-full mx-auto  object-cover"
        src={newImg || img}
        alt=""
      />
      <div
        className={
          'absolute w-full -bottom-10 group-hover:bottom-0 duration-150 transition-all'
        }
      >
        <UploadTrigger
          onChange={(url) => {
            onChange({ avatar: url + '?' + IMAGE_STYLE.AVATAR })
          }}
        >
          <div
            className={
              'cursor-pointer w-full bg-gray-300 text-white text-center text-xs'
            }
          >
            替换
          </div>
        </UploadTrigger>
      </div>
    </div>
  )
}

Avatar.defaultProps = {}
