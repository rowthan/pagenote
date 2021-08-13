import {Fragment, h, render} from 'preact';
import LightActionBar from "../component/LightActionBar";
import MoreIcon from '../assets/images/more.svg'
import Popover from "../component/tip/Popover";
import '../assets/styles/annotationMenu.scss'

export default function renderAnnotationMenu(rootElement,setting) {
    const {light,colors,moreActions = []} = setting;

    function generateOnclick(fun) {
        if (typeof fun === 'function'){
            return function () {
                fun(light)
            }
        }else{
            return function(){};
        }
    }

    render(
        <Fragment>
            <LightActionBar step={light} colors={colors}/>
            {
                moreActions.length>0 &&
                <Popover message={
                    <pagenote-block>{
                        moreActions.map((item)=>(
                            <pagenote-block
                                data-role="more-action-item"
                                onClick={generateOnclick(item.onclick)}>{item.text}</pagenote-block>
                        ))
                    }</pagenote-block>
                } inner={false} placement='rightBottom' trigger='hover'>
                    <pagenote-icon>
                        <MoreIcon />
                    </pagenote-icon>
                </Popover>
            }
        </Fragment>
        ,rootElement)
}
