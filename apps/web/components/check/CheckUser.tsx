import React, {ReactElement} from "react";
import useUserInfo from "../../hooks/useUserInfo";


export default function CheckUser({children,fallback}:{children:ReactElement,fallback?: ReactElement}) {
    const [user] = useUserInfo();
    if(!user?.profile?.nickname){
        return (
            fallback ||
            <div className="m-auto mt-20 card w-96 bg-base-200 shadow-xl">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">此模块需要登录后访问</h2>
                    <div className="card-actions">
                        <button className="btn btn-primary">
                            <a href="https://pagenote.cn/signin">前往登录</a>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    return(
        <>{children}</>
    )
}
