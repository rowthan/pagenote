import { useNavigate } from 'react-router-dom'
import BackSvg from '../../assets/svg/back.svg'
import React, { ReactElement } from 'react'

export default function SettingDetail(props: {
  children: ReactElement
  label: string | ReactElement
}) {
  const { children, label } = props
  const navigate = useNavigate()

  function back() {
    if (history.length > 1) {
      history.back()
    } else {
      navigate('/setting')
    }
  }

  return (
    <div className={''}>
      <div className={'flex px-1 items-center py-2 mb-8'}>
        <aside
          onClick={back}
          className={
            'flex items-center justify-center w-8 h-8 rounded-full hover:bg-base-300 cursor-pointer'
          }
        >
          <BackSvg className={'fill-current'} />
        </aside>
        <div className={'text-md ml-2'}>{label}</div>
      </div>
      <div className={''}>{children}</div>
    </div>
  )
}
