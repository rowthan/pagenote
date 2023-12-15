import { type ReactNode } from 'react'
import NotFoundSvg from '../../assets/svg/404/not_found.svg'

interface Props {
  children?: ReactNode
}

export default function NotFound(props: Props) {
  const { children } = props
  return (
    <div className="container relative flex flex-col items-center justify-between px-6 mx-auto">
      <div className="flex flex-col items-center justify-center w-full mb-16 space-x-12 md:flex-row md:mb-8">
        <h1 className="text-6xl font-thin text-center text-gray-400">
          走丢了 ?
        </h1>
        <nav className=" px-6 py-4 mx-auto md:px-12">
          <div className="items-center justify-between md:flex">
            <div className=" space-x-4 md:flex md:items-center md:justify-end">
              <a
                href="https://pagenote.cn/author"
                className="px-6 py-2 text-white text-center uppercase transition duration-200 ease-in bg-blue-400 border border-blue-400 w-36 hover:bg-blue-500 focus:outline-none"
              >
                帮助
              </a>
              <a
                href={''}
                className="px-6 py-2 text-center uppercase transition duration-200 ease-in border border-blue-400 w-36 hover:bg-blue-400 hover:text-white focus:outline-none"
              >
                重试
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className="relative block w-full mx-auto mt-6 md:mt-0">
        <NotFoundSvg className="max-w-3xl m-auto" />
      </div>
    </div>
  )
}

NotFound.defaultProps = {}
