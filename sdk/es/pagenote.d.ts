import PagenoteCore from './pagenote-core';
import './component/light/annotation.scss';
import { IOption } from "./types/Option";
declare function PageNote(id: string, options: IOption): PagenoteCore;
declare global {
    interface Window {
        PageNote: any;
    }
    interface ProxyConstructor {
        new <TSource extends object, TTarget extends object>(target: TSource, handler: ProxyHandler<TSource>): TTarget;
    }
}
export default PageNote;
