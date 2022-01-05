import './component/light/annotation.scss';
import { IOption } from "./types/Option";
declare function PageNote(id: string, options: IOption): any;
declare global {
    interface Window {
        PageNote: any;
    }
}
export default PageNote;
