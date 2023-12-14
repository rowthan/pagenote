import React, { useEffect } from 'react'
import { basePath } from 'const/env'
import RedirectToExt from '../../components/RedirectToExt'

export default function Data() {
  useEffect(() => {
    window.location.href = basePath + '/ext/setting.html#/setting/data'
  }, [])
  return (
    <RedirectToExt>
      <div>前往新页面</div>
    </RedirectToExt>
  )
}
