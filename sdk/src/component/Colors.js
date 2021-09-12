import { h } from 'preact';
import "./light/light-node.scss";
import ColorIcon from "../assets/images/color.svg";

export default function Colors({colors,current,selectColor}) {
    const setColor = function (color) {
        selectColor(color);
    };
    return(
        <pagenote-colors>
            <pagenote-color-items>
                {
                    colors.map((color)=>{
                        return <pagenote-icon aria-controls='color-item' onClick={() => { setColor(color)}}
                                              data-active={`${color === current ? '1' : ''}`}
                                              style={{backgroundColor: color}}/>
                    })
                }
            </pagenote-color-items>
            <pagenote-icon>
                <ColorIcon width={20} height={20} fill={current}/>
            </pagenote-icon>
        </pagenote-colors>
    )
};