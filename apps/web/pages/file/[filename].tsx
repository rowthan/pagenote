import {type ReactNode} from 'react';

interface Props {
    children?: ReactNode;
}

export default function filename(props: Props) {
    const {children} = props;
    return (
        <div className="">
            {children}
            <div>
                <h3>本地服务尚未启动，你需要安装 <a href="https://pagenote.cn">PAGENOTE</a> 插件后访问此页面...</h3>
            </div>
        </div>
    );
}

