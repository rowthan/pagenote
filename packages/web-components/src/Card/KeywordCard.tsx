import React, {FC, PropsWithChildren, ReactNode, useEffect, useState} from "react";
import classNames from "classNames";

interface Props {
    css?: string
    className?: string
    scrollBar: ReactNode
    footer: ReactNode
}

const Component: FC<PropsWithChildren<Props>> = (props) => {
    const [scrollTopInfo, setScrollTopInfo] = useState(0)

    function onScroll(e:any) {
        setScrollTopInfo(e.target.scrollTop)
    }
    useEffect(() => {

    }, [])

    const showNav = scrollTopInfo >= 10;

    return (
        <div className={'card-root text-left'}>
            <div className={classNames('flex flex-col bg-white box-border', props.className)}>
                {/*1. 置顶导航栏*/}
                <div
                    className={classNames('card-navbar bg-white w-full absolute left-0 top-0  transition-opacity duration-200 ease-in-out', {
                        'opacity-0': !showNav,
                        'opacity-1': showNav,
                        'select-none pointer-events-none': !showNav,
                    })}>
                    {props.scrollBar}
                </div>

                {/*2. 主体内容区*/}
                <div onScroll={onScroll} className="card-body overflow-x-hidden">
                    {props.children}
                </div>

                {/*3. 底部导航栏*/}
                <div className={'card-footer p-4'}>
                    {props.footer}
                </div>
            </div>
        </div>
    );
}
export default Component
