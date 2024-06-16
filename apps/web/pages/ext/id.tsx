import {HashRouter as Router} from 'react-router-dom'
import React from 'react'
import RedirectToExt from 'components/RedirectToExt'
import {useMountedState} from 'react-use'
import  {IdRoutes} from "components/account/id/IdHome";
import useUserInfo from "../../hooks/useUserInfo";
import ExtLayout from "../../layouts/ExtLayout";

export default function Id() {
    const mounted = useMountedState();
    const [ userInfo ] = useUserInfo()

    return (
        <ExtLayout title={'PAGENOTE ID'}>
            <RedirectToExt>
                <div className={'popup p-4 min-h-fill relative'}>
                    {
                        mounted() &&
                        <Router>
                            <IdRoutes rootPath={''}/>
                        </Router>
                    }
                </div>
            </RedirectToExt>
        </ExtLayout>
    )
}
