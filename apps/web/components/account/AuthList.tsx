import useAuthList from 'hooks/useAuthList'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UnbindForm from '../form/UnbindForm'
import Loading from '../loading/Loading'
import { AuthConfig, AuthType } from '../../const/oauth'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import IconButton from '../button/IconButton'
import useUserInfo from '../../hooks/useUserInfo'

export default function AuthList() {
  const { data: authList = [], mutate: fetch, isLoading } = useAuthList()
  const [index, setIndex] = useState(-1)
  const [data, mutate, setToken] = useUserInfo()

  const activeAuth = authList[index]

  function gotoAuth(authType: AuthType) {
    window.open(AuthConfig[authType].getAuthLInk())
  }

  return (
    <div>
      <Card className={'shadow-none'}>
        <CardHeader className={'border-b relative'}>
          <CardTitle>账号关联</CardTitle>
          <CardDescription>
            选择其他平台账号与 PAGENOTE 插件绑定关联。
          </CardDescription>
          <div className={'absolute right-2 top-2'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span>
                  <IconButton>
                    <DotsHorizontalIcon />
                  </IconButton>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
                <DropdownMenuItem
                  disabled={!data?.profile?.uid}
                  onClick={() => {
                    setToken(null)
                  }}
                >
                  退出账号
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        {isLoading && <Loading className={'!mx-auto my-3'} />}
        <ul className="divide-y divide w-full">
          {authList.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center px-4 hover:bg-accent"
            >
              <div className="flex flex-col items-center justify-center w-10 h-10 mr-4">
                <img
                  alt={item.authType}
                  src={AuthConfig[item.authType]?.icon}
                  className="mx-auto object-cover rounded-full h-6 w-6 bg-white"
                />
              </div>

              <div className={'flex text-sm'}>
                {item.valid ? (
                  <span className={'tooltip'} data-tip={'已验证'}>
                    ✅
                  </span>
                ) : (
                  <button
                    className={'text-destructive tooltip'}
                    data-tip={'点击前往验证'}
                    onClick={() => {
                      gotoAuth(item.authType)
                    }}
                  >
                    ❌未验证
                  </button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex text-xs text-gray-600 dark:text-gray-200">
                      <button
                        className={'tooltip ml-1'}
                        data-tip={item.authEmail}
                      >
                        {item.authName}
                      </button>
                      {item.authAvatar && (
                        <img
                          alt="profil"
                          src={item.authAvatar}
                          className="mx-auto ml-1 object-cover rounded-full h-6 w-6 bg-white"
                        />
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setIndex(index)
                      }}
                    >
                      取消绑定关系
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={'w-full border-t'} variant={'ghost'}>
              添加授权
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuGroup>
              {[AuthType.GITHUB, AuthType.NOTION, AuthType.EMAIL].map(
                (item) => (
                  <DropdownMenuItem
                    key={AuthConfig[item].label}
                    onClick={() => {
                      gotoAuth(item)
                    }}
                  >
                    {AuthConfig[item].label}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>

      <Dialog
        open={!!activeAuth}
        onOpenChange={(open) => {
          setIndex(-1)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确定删除关联?</DialogTitle>
            <DialogDescription>
              删除后将无法继续使用该账号对应的一键登录账号等功能。
            </DialogDescription>
          </DialogHeader>

          <UnbindForm
            auth={activeAuth}
            onFinished={() => {
              fetch()
              setIndex(-1)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
