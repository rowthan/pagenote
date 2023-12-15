import React from 'react'
import { CaptureButton, LightInfo, PageInfo } from './state/PageInfo'
import DisableButton from './state/DisableButton'

interface Props {
  pageKey?: string
}

export default function Achieve() {
  return (
    <div className="">
      <div className={'flex gap-4 items-center justify-between'}>
        <div className={'flex gap-4 items-center'}>
          <CaptureButton />
          <PageInfo />
          <LightInfo />
        </div>

        <DisableButton />
      </div>
    </div>
  )
}

Achieve.defaultProps = {}
