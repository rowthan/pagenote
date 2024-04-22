import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import OutLink from 'assets/svg/outlink.svg'
import HomeSvg from 'assets/svg/home.svg'
import CloseSvg from 'assets/svg/close.svg'
import React, { useEffect, useRef } from 'react'
import useWhoAmi from 'hooks/useWhoAmi'
import useCurrentTab from '../../hooks/useCurrentTab'
import useConfig from '../../hooks/useConfig'
import {openUrlInGroup} from "../../utils/url";
import { FaRegUserCircle } from "react-icons/fa";

interface Tab {
  label: string
  outlink: string
  link: string
}

const tabs: Tab[] = [
  {
    label: '标签页',
    outlink: '',
    link: '/',
  },
  {
    label: '临时剪切板',
    outlink: '',
    link: '/clipboard',
  },
  // {
  //   label: '设置',
  //   outlink: '',
  //   link: '/setting',
  // },
]
export default function NavTabs(props: { keyword: string, onChangeKeyword: (keyword: string) => void }) {
    const [whoAmi] = useWhoAmi();
    const navigate = useNavigate();
    const location = useLocation();
    const {tab} = useCurrentTab();
    const config = useConfig();
    const {keyword,onChangeKeyword} =props;
    const ref = useRef<HTMLInputElement>(null)

    function gotoSearch() {
        navigate('/search')
    }

    function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
      // POPUP 模式下，无效，页面被关掉
      if (e.key === 'Escape') {
        onChangeKeyword('')
      } else if (e.key === 'Enter') {
        onChangeKeyword(e.currentTarget.value)
        if (e.currentTarget.value) {
          navigate('/search')
        }
      }
      e.stopPropagation()
      e.preventDefault()
    }

    useEffect(function () {
        if(!tab){
            return
        }
        // if(config?.searchEngines?.length){
        //     const searchKey = getSearchKeyFormUrl(tab?.url,config.searchEngines);
        //     if(searchKey){
        //         onChangeKeyword(searchKey)
        //         navigate('/search')
        //     }
        // }
    },[tab,config,onChangeKeyword,navigate])

    const isSearchPath = location.pathname === '/search'
    return (
      <div className=" !bg-transparent max-w-full">
        {tabs.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            className={({ isActive }) =>
              `tab tab-lifted tab-${isActive ? 'active !bg-transparent' : ''}`
            }
          >
            {item.label}
            {item.outlink && <OutLink width={14} height={14} />}
          </NavLink>
        ))}
        <div
          className={`tab tab-lifted ${isSearchPath ? 'tab-active' : ''}`}
          onClick={gotoSearch}
        >
          <input
            type="text"
            placeholder={'搜索 ' + keyword}
            autoFocus={true}
            value={keyword}
            ref={ref}
            onKeyUp={onKeyUp}
            onChange={(e) => {
              navigate('/search')
              onChangeKeyword(e.target.value)
            }}
            className={`input input-xs input-bordered w-44  ${
              isSearchPath ? '' : ''
            }`}
          />
          {keyword && (
            <span className="absolute right-5 ">
              <CloseSvg
                onClick={() => {
                  onChangeKeyword('')
                  ref.current?.focus()
                }}
                className={'fill-current text-neutral'}
              />
            </span>
          )}
        </div>
          <a className={'link absolute right-14 top-2 text-lg '} onClick={()=>{
              openUrlInGroup(`${whoAmi?.origin}/web/ext/id.html`)
          }}>
              <FaRegUserCircle  className={'fill-current'}/>
          </a>
        <a
          onClick={()=>{
              openUrlInGroup(`${whoAmi?.origin}/pagenote.html#/notes/updateAtDay`)
          }}
          target={'_blank'}
          data-tip={'前往管理页'}
          className={`link absolute right-5 top-1 tooltip tooltip-left flex`}
        >
          <HomeSvg
            className={'fill-current  hover:text-accent-foreground'}
            width={24}
            height={24}
          />
        </a>
      </div>
    )
}
