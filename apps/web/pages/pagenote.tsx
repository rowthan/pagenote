import Modal from 'components/Modal'
import React, { useEffect } from 'react'
import useWhoAmi from '../hooks/useWhoAmi'

export default function Pagenote() {
  const [whoAmI] = useWhoAmi()

  useEffect(
    function () {
      if (whoAmI?.origin) {
        window.location.href = whoAmI.origin + '/pagenote.html'
      }
    },
    [whoAmI]
  )
  return (
    <div className="">
      <Modal open={true}>
        <img
          src="https://pagenote-public.oss-cn-beijing.aliyuncs.com/_static/manage-entry.png"
          alt="popup pagenote"
        />
      </Modal>
    </div>
  )
}
