import { h } from 'preact';
import style from "./light/light-node.scss";
import ColorIcon from "../assets/images/color.svg";

export default function Colors({colors,current,selectColor}) {
    const setColor = function (color) {
        selectColor(color);
    };
    return(
        <div className={style.colors}>
            <div className={style.colorOptions}>
                {
                    colors.map((color)=>{
                        return <pagenote-icon aria-controls='color-item' onClick={() => { setColor(color)}}
                                              className={`${style.colorItem} ${color === current ? style.active : ''}`}
                                              style={{backgroundColor: color}}/>
                    })
                }
            </div>
            <pagenote-icon aria-controls='color-item'>
                <ColorIcon width={20} height={20} fill={current}/>
            </pagenote-icon>
        </div>
    )
};