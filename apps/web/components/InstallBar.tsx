import React, {ReactElement} from "react";

const InstallBar: React.FC<{children?: ReactElement}> =  function ({children}) {
    return (
        <div>
            <div className='text-center'>
                <a className={'hover:text-blue-600 text-blue-400'} href="https://pagenote.cn/release">前往安装</a>
            </div>
            {children}
        </div>
    )
}

export default InstallBar
