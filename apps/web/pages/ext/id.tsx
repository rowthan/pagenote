import {HashRouter as Router} from 'react-router-dom'
import React from 'react'
import BasicLayout from 'layouts/BasicLayout'
import RedirectToExt from 'components/RedirectToExt'
import {useMountedState} from 'react-use'
import  {IdRoutes} from "components/account/id/IdHome";
import useUserInfo from "../../hooks/useUserInfo";

export default function Id() {
    const mounted = useMountedState();
    const [ userInfo ] = useUserInfo()

    return (
        <BasicLayout nav={false} footer={true} title={'PAGENOTE ID'} full={true}>
            <RedirectToExt>
                <div className={'popup w-basic p-4 min-h-fill relative'}>
                    {
                        mounted() &&
                        <Router>
                            <IdRoutes rootPath={''}/>
                        </Router>
                    }
                </div>
            </RedirectToExt>
        </BasicLayout>
    )
}
