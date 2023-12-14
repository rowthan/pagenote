import Head from 'next/head'
import { PropsWithChildren } from 'react'

import Footer from 'components/Footer'
import Breadcrumbs from './Breadcrumbs'

export default function DeveloperContainer(
  props: PropsWithChildren<{
    date?: string
    title?: string
    description?: string
    type?: string
  }>
) {
  // After mounting, we have access to the theme

  const { children, ...customMeta } = props
  const meta = {
    title: 'PAGENOTE',
    description: `一页一记 pagenote，开发者中心.`,
    type: 'website',
    ...customMeta,
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="PAGENOTE" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>
      <div className="flex flex-col justify-center px-8">
        <nav className="flex items-center justify-between w-full relative max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pt-8 pb-8 sm:pb-16  text-gray-900 bg-gray-50  dark:bg-gray-900 bg-opacity-60 dark:text-gray-100">
          {/*<a href="#skip" className="skip-nav">*/}
          {/*  Skip to content*/}
          {/*</a>*/}
          <div className="ml-[-0.60rem]">
            {/*<MobileMenu />*/}
            {/*<NavItem href="/" text="首页" />*/}
            {/*<NavItem href="/demo" text="demo" />*/}
            {/*<NavItem href="/projects" text="所有项目" />*/}

            <Breadcrumbs />
          </div>
          {/*<button*/}
          {/*  aria-label="Toggle Dark Mode"*/}
          {/*  type="button"*/}
          {/*  className="w-9 h-9 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center  hover:ring-2 ring-gray-300  transition-all"*/}
          {/*  onClick={() =>*/}
          {/*    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')*/}
          {/*  }*/}
          {/*>*/}
          {/*  {mounted && (*/}
          {/*    <svg*/}
          {/*      xmlns="http://www.w3.org/2000/svg"*/}
          {/*      viewBox="0 0 24 24"*/}
          {/*      fill="none"*/}
          {/*      stroke="currentColor"*/}
          {/*      className="w-5 h-5 text-gray-800 dark:text-gray-200"*/}
          {/*    >*/}
          {/*      {resolvedTheme === 'dark' ? (*/}
          {/*        <path*/}
          {/*          strokeLinecap="round"*/}
          {/*          strokeLinejoin="round"*/}
          {/*          strokeWidth={2}*/}
          {/*          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"*/}
          {/*        />*/}
          {/*      ) : (*/}
          {/*        <path*/}
          {/*          strokeLinecap="round"*/}
          {/*          strokeLinejoin="round"*/}
          {/*          strokeWidth={2}*/}
          {/*          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"*/}
          {/*        />*/}
          {/*      )}*/}
          {/*    </svg>*/}
          {/*  )}*/}
          {/*</button>*/}
        </nav>
      </div>
      <main
        id="skip"
        className="flex flex-col justify-center px-8 bg-gray-50 dark:bg-gray-900"
      >
        {children}
        <Footer />
      </main>
    </div>
  )
}
