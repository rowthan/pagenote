import { type ReactNode, useEffect, useState } from 'react'
import useSettingConfig from '../../../hooks/table/useSettingConfig'
import classNames from 'classnames'
import Modal from '../../Modal'
import { useForm } from 'react-hook-form'
import { get } from 'lodash'
import { checkCloudPut, OssCloudConfig } from '../../../utils/upload'

interface Props {
  cloudServer: 'customAliOss' | 'webdav'
}

enum ConnectState {
  un_check = 0,
  checking = 1,
  success = 2,
  fail = -1,
}

const labelMap: Record<ConnectState, string> = {
  [ConnectState.un_check]: '待检测',
  [ConnectState.checking]: '检测中',
  [ConnectState.success]: '已连接',
  [ConnectState.fail]: '连接失败',
}
export default function CloudStatus(props: Props) {
  const { cloudServer } = props
  const [open, setOpen] = useState(false)
  const [config, update] = useSettingConfig<OssCloudConfig>(cloudServer,'config')
  const [state, setState] = useState<ConnectState>(ConnectState.un_check)

  const { setValue, register, handleSubmit } = useForm({
    defaultValues: config || {},
  })

  useEffect(
    function () {
      for (let i in config) {
        // @ts-ignore
        setValue(i, config[i])
      }
    },
    [config]
  )

  const filled =
    config?.region &&
    config.accessKeyId &&
    config.accessKeySecret &&
    config.bucket
  let connected = state === ConnectState.success
  const checking = state === ConnectState.checking
  let label = filled ? labelMap[state] : '未配置'

  function save(data: OssCloudConfig) {
    update(data)
    check(data)
  }

  function check(data: OssCloudConfig) {
    setState(ConnectState.checking)
    checkCloudPut(data).then(function (res) {
      if (res.name) {
        setState(ConnectState.success)
      } else {
        setState(ConnectState.fail)
      }
    })
  }

  return (
    <>
      <button
        className={classNames('btn btn-xs btn-outline btn-info', {
          'btn-success': connected,
          'btn-warning': !filled,
          'btn-info': checking,
          'btn-error': filled && !connected,
        })}
        onClick={() => {
          setOpen(!open)
        }}
      >
        {label}
      </button>
      <Modal open={open} toggleOpen={setOpen}>
        <div>
          <h3>配置你的个人云</h3>
          <div className={'text-sm text-color-400'}>阿里云</div>

          <form onSubmit={handleSubmit((data) => save(data))}>
            <label>
              地区：
              <input
                type="text"
                autoFocus={true}
                {...register(`region`, { required: true })}
              />
            </label>

            <label>
              bucket：
              <input
                type="bucket"
                autoFocus={true}
                {...register(`bucket`, { required: true })}
              />
            </label>

            <label>
              accessKeyId：
              <input
                type="text"
                autoFocus={true}
                {...register(`accessKeyId`, { required: true })}
              />
            </label>

            <label>
              accessKeySecret：
              <input
                type="text"
                autoFocus={true}
                {...register(`accessKeySecret`, { required: true })}
              />
            </label>

            <button type={'submit'}>保存</button>
          </form>
        </div>
      </Modal>
    </>
  )
}

