import {Fragment, h, render} from 'preact';
import LightActionBar from "../component/LightActionBar";
import MoreIcon from '../assets/images/more.svg'
import Popover from "../component/tip/Popover";

export default function renderAnnotationMenu(rootElement,setting) {

    render(
        <Fragment>
            <LightActionBar step={setting.light} colors={setting.colors}/>
            <Popover message={
                <pagenote-icon>
                    <MoreIcon />
                </pagenote-icon>
            } inner={false} placement='rightBottom' trigger='hover'>
                <pagenote-icon>
                    <MoreIcon />
                </pagenote-icon>
            </Popover>

        </Fragment>
        ,rootElement)
}