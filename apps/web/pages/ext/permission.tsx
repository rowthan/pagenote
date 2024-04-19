import {type ReactNode, useEffect} from 'react';
import RedirectToExt from "../../components/RedirectToExt";
import {basePath} from "../../const/env";
interface Props {
    children?: ReactNode;
}

export default function Permission() {
    useEffect(() => {
        window.location.href = `${basePath}/ext/setting.html#setting/permission`
    }, []);
    return (
        <RedirectToExt>
            <div>
                redirect...
            </div>
        </RedirectToExt>
    );
}

