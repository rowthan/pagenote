import NextLink from 'next/link'
import { Fragment, useMemo } from 'react'
import { useRouter } from 'next/router'

export interface RouteInfo {
  id: string
  name: string
  path: string
  disable?: boolean
  children?: RouteInfo[]
}

const routesMap: RouteInfo = {
  id: 'home',
  name: '首页',
  path: '',
  children: [
    {
      name: '管理',
      path: '/manage',
      id: 'manage',
      disable: true,
      children: [
        {
          id: 'pages',
          name: '网页',
          path: '/manage/page',
        },
        {
          id: 'light',
          name: '标记',
          path: '/manage/light',
        },
        {
          id: 'clipboard',
          name: '临时剪切板',
          path: '/manage/clipboard',
        },
        // {
        //     id: 'trash',
        //     name: '网页回收站',
        //     path: '/manage/trash',
        // },
      ],
    },
    {
      name: '开发者中心',
      path: '/',
      id: 'developer',
      children: [
        {
          id: 'demo',
          name: '示例',
          path: '/developer/demo',
        },
        {
          id: 'project',
          name: '项目',
          path: '/developer/project',
        },
      ],
    },
    {
      id: 'backup',
      name: '数据备份',
      path: '/backup',
    },
    {
      id: 'contact',
      name: '联系',
      path: '/contact/feedback',
      children: [
        {
          id: 'feedback',
          name: '反馈',
          path: '/contact/feedback',
        },
      ],
    },
  ],
}

export default function Breadcrumbs() {
  const { asPath } = useRouter()

  // const currentPathArray = asPath.split('/')

  // const routesArray = routes.map(function (key, index) {
  //     const pathKey = routes.slice(0, index + 1).join('.');
  //     const routeInfo = get(routesMap, pathKey);
  //     console.log('route', routeInfo)
  //     return routeInfo
  // }).filter(function (item) {
  //     return !!item;
  // })

  return (
    <div className="text-sm breadcrumbs overflow-visible z-50">
      {useMemo(
        () => (
          <ul>
            {/*{*/}
            {/*    [routesMap].map(function (item) {*/}
            {/*        return <NextLink key={item.name} href={item.path}>{item.name}</NextLink>*/}
            {/*    })*/}
            {/*}*/}
            <RenderRouteGroup routeArray={[routesMap]} level={0} />
          </ul>
        ),
        [asPath]
      )}
    </div>
  )
}

function RenderLink(props: { route: RouteInfo }) {
  const { route } = props
  return route.disable ? (
    <span>{route.name}</span>
  ) : (
    <NextLink href={route.path || '/'}>{route.name}</NextLink>
  )
}

function RenderRouteGroup(props: { routeArray: RouteInfo[]; level: number }) {
  const { asPath } = useRouter()
  const { level } = props
  const { routeArray = [] } = props
  const currentPathArray = asPath.split('/')

  function checkRouteMatched(route: RouteInfo) {
    return route.path === currentPathArray.slice(0, level + 1).join('/')
  }

  return (
    <Fragment>
      {routeArray.map((route) => {
        const currentMatched = checkRouteMatched(route)
        const brotherRoutes = routeArray.filter(function (item) {
          return !checkRouteMatched(item)
        })
        return (
          <Fragment key={route.name}>
            {currentMatched && (
              <li key={route.name}>
                {
                  <div>
                    <div className="dropdown dropdown-hover">
                      <label tabIndex={0} className="pl-1">
                        <RenderLink route={route} />
                      </label>
                      {brotherRoutes.length > 0 && (
                        <ul
                          tabIndex={0}
                          className="dropdown-content p-1 shadow rounded-box bg-base-100 min-w-10"
                        >
                          {
                            // 同级菜单
                            brotherRoutes.map(function (item) {
                              return checkRouteMatched(item) ? (
                                <Fragment key={item.path}></Fragment>
                              ) : (
                                <li key={item.path} className="py-2">
                                  <RenderLink route={item} />
                                </li>
                              )
                            })
                          }
                        </ul>
                      )}
                    </div>
                  </div>
                }
              </li>
            )}
            {route.children?.length && (
              <RenderRouteGroup routeArray={route.children} level={level + 1} />
            )}
          </Fragment>
        )
      })}
    </Fragment>
  )
}
