import useCurrentTab from 'hooks/useCurrentTab'
import useSettings from 'hooks/useSettings'
import { refreshTab } from 'utils/popup'
import useTabPagenoteState from 'hooks/useTabPagenoteState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { BiHighlight } from 'react-icons/bi'
import { TbHighlightOff } from 'react-icons/tb'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
  SwitchIcon,
} from '@radix-ui/react-icons'
import { Button } from '../../../@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import KeyboardTip from '../../KeyboardTip'
import { useNavigate } from 'react-router-dom'

function checkDisabled(rule: string, url: string) {
  return rule === url || (rule.indexOf('*') > -1 && new RegExp(rule).test(url))
}

enum EnableType {
  enable = 'enable',
  disableDomain = 'disable-domain',
  disableUrl = 'disable-url',
}

export default function DisableButton() {
  const { tab } = useCurrentTab()
  const [tabState] = useTabPagenoteState()
  const { data: setting, update } = useSettings()
  const disabledList = setting.disableList || []
  const navigate = useNavigate()

  const url = tab?.url || ''
  const disabled =
    url &&
    disabledList.some(function (item) {
      return checkDisabled(item, url)
    })

  const set = new Set(disabledList)

  function add(url?: string) {
    if (!url) {
      return
    }
    set.add(url)
    const newList = Array.from(set)
    update(
      {
        disableList: newList,
      },
      function () {
        refreshTab(tab)
      }
    )
  }

  function remove(url?: string) {
    if (!url) {
      return
    }
    set.delete(url)
    const newList = Array.from(set)
    update(
      {
        disableList: newList,
      },
      function () {
        refreshTab(tab)
      }
    )
  }

  const disableDomain = url ? `${new URL(url).origin}/*` : ''

  function onChangeDisableRule(type: EnableType | string) {
    switch (type) {
      case EnableType.disableDomain:
        add(disableDomain)
        break
      case EnableType.disableUrl:
        add(url)
        break
      case EnableType.enable:
        disabledList.forEach(function (item) {
          const matched = checkDisabled(item, url)
          if (matched) {
            remove(item)
          }
        })
        break
    }
  }

  let value = ''
  if (tabState?.active) {
    value = EnableType.enable
  } else if (set.has(disableDomain)) {
    value = EnableType.disableDomain
  } else if (set.has(url)) {
    value = EnableType.disableUrl
  }

  const enabled = value === EnableType.enable

  return (
    <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
      <KeyboardTip tip={'点击切换状态'}>
        <Button
          variant="secondary"
          size={'sm'}
          className="px-3 shadow-none"
          onClick={() => {
            onChangeDisableRule(
              enabled ? EnableType.disableUrl : EnableType.enable
            )
          }}
        >
          <SwitchIcon color={enabled ? 'green' : 'red'} className="mr-2 h-4" />
          {enabled ? '已启用' : '已禁用'}
        </Button>
      </KeyboardTip>

      <Separator orientation="vertical" className="h-[20px]" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size={'sm'} className="px-1 shadow-none">
            <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-5}
          className="w-[200px]"
          forceMount
        >
          <DropdownMenuCheckboxItem
            checked={value === EnableType.disableUrl}
            onClick={() => {
              onChangeDisableRule(EnableType.disableUrl)
            }}
          >
            在此网页禁用
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={value === EnableType.disableDomain}
            onClick={() => {
              onChangeDisableRule(EnableType.disableDomain)
            }}
          >
            在此域名禁用
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate('/setting/disable')
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            设置更多规则
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
