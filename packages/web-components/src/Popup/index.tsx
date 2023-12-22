import React, {FC, PropsWithChildren} from "react";
import withComponentStyles from "../HOC";
import '../tailwind.css'
interface Props {
    css?: string
    left:number,
    top: number
}

const Popup: FC<PropsWithChildren<Props>> = (props) => {
    const {children,left,top} = props;

    return (
        <div className={'popup-portal fixed left-0 top-0 bottom-0 right-0 z-50 pointer-events-none'}>
            <div className="popup-wrapper fixed border-none pointer-events-auto rounded-[10px] overflow-hidden" style={{
                left: left + 'px',
                top: top + 'px',
                boxShadow: "rgba(31, 35, 41, 0.04) 0px 8px 24px 8px, rgba(31, 35, 41, 0.04) 0px 6px 12px 0px, rgba(31, 35, 41, 0.06) 0px 4px 8px -8px",
            }}>
                {children}
            </div>
        </div>
    );
}


const WebComponent =  withComponentStyles(Popup)

export {WebComponent}
export default Popup



