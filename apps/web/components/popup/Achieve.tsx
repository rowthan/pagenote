import React from 'react'
import { CaptureButton, LightInfo, PageInfo } from './state/PageInfo'
import DisableButton from './state/DisableButton'
import useCurrentTab from "../../hooks/useCurrentTab";
import useTabPagenoteState from "../../hooks/useTabPagenoteState";

export default function Achieve() {
  const {tab} = useCurrentTab()
  const [content] = useTabPagenoteState()

  return (
    <div className="">
      <div className={'flex gap-4 items-center justify-between'}>
        <div className={'flex gap-4 items-center'}>
          <CaptureButton pageKey={content?.pageKey || tab?.url} />
          <PageInfo pageUrl={content?.pageUrl || tab?.url || ''} />
          <LightInfo pageUrl={content?.pageUrl || tab?.url || ''} />
        </div>
        <DisableButton />
      </div>
    </div>
  )
}

Achieve.defaultProps = {}
