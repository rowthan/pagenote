import { useForm } from 'react-hook-form'
import { ReactElement, useEffect, useState } from 'react'
import CommonForm, { CommonFormField } from 'components/CommonForm'
import useUserInfo, { fetchUserInfo } from '../../hooks/useUserInfo'
import { UpdateProfile, updateProfile } from '../../service'
import { toast } from '../../utils/toast'

enum SubmitState {
  unset = 0,
  loading = 1,
  success = 2,
  error = 3,
}

interface FormData {
  nickname: string
}

const fields: CommonFormField[] = [
  {
    type: 'text',
    name: 'nickname',
    options: {
      required: '请输入昵称',
    },
    placeholder: '修改你的昵称',
    label: '昵称',
  },
]

export default function UserInfoForm() {
    const [user, refresh] = useUserInfo()
    const [loading, setLoading] = useState(false)

    function onSubmit(data: FormData) {
        setLoading(true)
        updateProfile({
            nickname: data.nickname,
        })
          .then(function () {
              fetchUserInfo(true).then(function () {
                  refresh()
              })
          })
          .finally(function () {
              setLoading(false)
          })
    }

    return (
      <div>
          <CommonForm
            loading={loading}
            value={user?.profile}
            fields={fields}
            onSubmit={onSubmit}
          />
      </div>
    )
}
