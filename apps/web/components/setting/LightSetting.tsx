import OutLink from '../../assets/svg/outlink.svg'
import React from 'react'
import useSettings from '../../hooks/useSettings'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'
import SettingDetail from './SettingDetail'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function LightSetting() {
  const { data: setting, update: updateSetting } = useSettings()

  const { keyupTimeout, showBarTimeout } = setting

  return (
    <SettingDetail label={'画笔设置'}>
      <div className={'relative'}>
        <SettingSection>
          <BasicSettingLine
            label={'标记快捷键灵敏度'}
            right={
              <Select
                defaultValue={`${keyupTimeout}`}
                value={`${keyupTimeout}`}
                onValueChange={(newValue) => {
                  updateSetting({ keyupTimeout: Number(newValue) })
                }}
              >
                <SelectTrigger className={'w-auto border-none shadow-none'}>
                  <SelectValue placeholder={'敏捷度调节'} />
                </SelectTrigger>
                <SelectContent position={'item-aligned'}>
                  <SelectItem value={'0'}>灵敏，按下即触发</SelectItem>
                  <SelectItem value="500">适中，长按0.5秒</SelectItem>
                  <SelectItem value="2000">迟缓，长按2秒</SelectItem>
                </SelectContent>
              </Select>
            }
          ></BasicSettingLine>
          <BasicSettingLine
            label={'画笔面板出现时机'}
            right={
              <Select
                defaultValue={`${showBarTimeout}`}
                value={`${showBarTimeout}`}
                onValueChange={(newValue) => {
                  updateSetting({ showBarTimeout: Number(newValue) })
                }}
              >
                <SelectTrigger className={'w-auto border-none shadow-none'}>
                  <SelectValue placeholder={'敏捷度调节'} />
                </SelectTrigger>
                <SelectContent position={'item-aligned'}>
                  <SelectItem value={'0'}>立刻</SelectItem>
                  <SelectItem value="1000">迟缓</SelectItem>
                </SelectContent>
              </Select>
            }
          ></BasicSettingLine>

          <BasicSettingLine
            label={'禁用规则'}
            className={'cursor-pointer'}
            path={'/disable'}
            subLabel={
              <div>
                {setting?.disableList?.length
                  ? `${setting?.disableList?.length}条规则`
                  : ''}
              </div>
            }
          ></BasicSettingLine>
        </SettingSection>

        <div>
          <a
            href="/pagenote.html#setting"
            target={'_blank'}
            className={'mt-10 block '}
          >
            <SettingSection>
              <BasicSettingLine
                label={'画笔设置'}
                subLabel={'添加画笔、修改颜色'}
                right={<OutLink className={'fill-current'} />}
              ></BasicSettingLine>
            </SettingSection>
          </a>
        </div>

        <div className={'mt-6'}>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                variant={'destructive'}
                size={'sm'}
                className={'absolute right-4'}
              >
                重置
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定重置?</AlertDialogTitle>
                <AlertDialogDescription>
                  画笔、插件等设置将恢复为初始值
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    updateSetting(null)
                  }}
                >
                  确认
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </SettingDetail>
  )
}
