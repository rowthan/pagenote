import { ReactComponentElement, type ReactNode } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMountedState } from 'react-use'
import QuestionSvg from '../assets/svg/question.svg'
import { useRouter } from 'next/router'
import { basePath, isExt } from '../const/env'
import {
  RocketIcon,
  QuestionMarkCircledIcon,
  MixerHorizontalIcon,
  StarIcon,
} from '@radix-ui/react-icons'

interface Props {
  children?: ReactNode
}

export default function HelpAside(props: Props) {
    const {children} = props
    const {pathname} = useRouter()
    const mounted = useMountedState();
    const asideList: {
      label: string
      link?: string
      onClick?: () => void
      icon: ReactComponentElement<any>
      target?: '_self' | '_blank'
    }[] = [
      {
        label: '帮助',
        link: 'https://pagenote.cn/question',
        icon: <QuestionMarkCircledIcon className={'fill-current inline'} />,
      },
      // {
      //   label: 'VIP',
      //   link: 'https://pagenote.cn/pro',
      //   icon: <RocketIcon className={'fill-current inline'} />,
      // },
    ]
    if (pathname.includes('/ext')) {
      asideList.push({
        label: '设置',
        link: basePath + '/ext/setting.html',
        icon: <MixerHorizontalIcon className={'fill-current inline'} />,
        target: '_blank',
      })
    } else {
      asideList.push({
        label: '设置',
        link: 'https://pagenote.cn/setting',
        icon: <MixerHorizontalIcon className={'fill-current inline'} />,
        target: '_self',
      })
    }
    if (!isExt) {
      asideList.push({
        label: '评分',
        link: 'https://pagenote.cn/rate',
        icon: <StarIcon className={'fill-current inline'} />,
      })
    }

    return (
      <div className="bg-accent">
        {children}
        <aside className={'fixed right-4 bottom-6 pb-2'}>
          {mounted() && (
            <Popover>
              <PopoverTrigger>
                <QuestionSvg
                  className={'fill-current bg-background'}
                  width={20}
                  height={20}
                />
              </PopoverTrigger>
              <PopoverContent className="px-0 bg-background">
                <ul
                  tabIndex={0}
                  className="w-32 right-4 overflow-hidden bottom-full text-sm"
                >
                  {asideList.slice(0, 3).map((item, index) => (
                    <li
                      key={index}
                      className={
                        'py-1 px-2 hover:bg-accent hover:text-foreground'
                      }
                      onClick={item.onClick}
                    >
                      <a
                        className={' flex items-center w-full'}
                        href={item.link}
                        target={item.target || '_blank'}
                      >
                        {item.icon}
                        <span className={'ml-1'}>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          )}
        </aside>
      </div>
    )
}

HelpAside.defaultProps = {}
