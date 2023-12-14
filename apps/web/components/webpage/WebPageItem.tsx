import {WebPage} from "@pagenote/shared/lib/@types/data";
import HighLightText from "../HighLightText";
import dayjs from "dayjs";

export default function WebPageItem(props:{webpage: Partial<WebPage>, keyword: string}) {
    const {webpage:item,keyword} = props;
    return (
        <div>
            <aside className="inline-block relative max-w-full">
                <a href={item.url || item.key} target={'_blank'} className={'max-w-full link link-primary text-md inline-block truncate'}>
                    <img src={item.icon} width={14} height={14} className={'inline-block mr-2'}/>
                    <HighLightText hideOnUnMatch={false} keyword={keyword} text={item.title || item.key || ''} />
                </a>
            </aside>

            <div className={'text-gray-400 text-sm'}>
                <time className={'mr-1 text-xs'}>
                    {dayjs(item.updateAt).format('YYYY-MM-DD')} |
                </time>
                {
                    item.categories?.map((category)=>(
                        <span className="badge badge-sm" key={category}> <HighLightText text={category} keyword={keyword} /></span>
                    ))
                }
                <HighLightText hideOnUnMatch={true} keyword={keyword} text={item.description||''} />
            </div>
            <div>
                {(item?.plainData?.steps || []).map( (light)=>(
                    <div key={light.key} className={'text-sm p-1'}>
                        <span className={'badge badge-xs'} style={{backgroundColor: light.bg}}></span>
                        {/*<HighLightText keyword={keyword} text={light.pre || ''} />*/}
                        <span style={{borderColor: light.bg}} className={'border-b'}>
                            <HighLightText keyword={keyword} text={light.text || ''} />
                        </span>
                        {/*<HighLightText keyword={keyword} text={light.suffix || ''} />*/}
                        <HighLightText keyword={keyword} text={light.tip || ''} />
                    </div>
                ))}
            </div>
        </div>
    )
}
