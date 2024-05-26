import {useLocation, useNavigate, useRoutes} from 'react-router-dom'
import BackSvg from '../../assets/svg/back.svg'
import React, {ReactElement} from 'react'
import Head from "next/head";
import {useWindowSize} from "react-use";
import {routes} from "./Setting";
import { IoIosArrowBack } from "react-icons/io";

export default function SettingDetail(props: {
    children: ReactElement
    label: string | ReactElement
}) {
    const {children, label} = props
    const navigate = useNavigate();
    const location = useLocation();
    const {width} = useWindowSize(900, 600)
// 计算上一级路由
    const pathList = location.pathname.split('/');
    const parentPath = pathList.slice(0, pathList.length - 1).join('/') || '/';

    function back() {
        const pathList = location.pathname.split('/');
        if (pathList.length > 1) {
            const path = pathList.slice(0, pathList.length - 1).join('/') || '/';
            return navigate(path)
        } else {
            if (Number(history.state.idx) > 1) {
                return history.go(-1)
            }
        }
        navigate('/')
    }

    const showTitle = width < 600 || location.pathname.split('/').length > 2;
    const parentTitle = routes[parentPath]?.title

    return (
        <div className={''}>
            <Head>
                <title>{label}</title>
            </Head>
            {
                label &&
                <div className={'detail-nav mb-8 relative flex items-center py-2'}>
                    <aside
                        onClick={back}
                        className={
                            'absolute left-0 p-1 flex gap-1 items-center justify-center text-center rounded-lg hover:bg-base-300 cursor-pointer text-blue-400'
                        }
                    >
                        <IoIosArrowBack size={24} className={'fill-current text-sm'}/>
                        {parentTitle && <span className={''}>{parentTitle}</span>}
                    </aside>
                    <div className={'text-md ml-2 text-center flex-grow'}>{label}</div>
                </div>
            }

            {children}
        </div>
    )
}
