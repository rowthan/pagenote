import {Fragment, h, render} from 'preact';
import Tip from "../component/tip/Tip";
import i18n from "../locale/i18n";
import MoreIcon from '../assets/images/more.svg'
import CopyIcon from "../assets/images/copy.svg";
import DeleteIcon from "../assets/images/delete.svg";
import NoteIcon from '../assets/images/note.svg';
import PinIcon from '../assets/images/pin.svg';
import Popover from "../component/tip/Popover";
import '../assets/styles/annotationMenu.scss'
import {useState} from "preact/hooks";
import {writeTextToClipboard} from "../utils/document";
import {Colors} from "../component/light/LightNode";
import {AnnotationStatus, LightStatus} from "../step/const";


function LightActionBar({step,colors}) {
    const {data} = step;
    const [copied,setCopy] = useState(false);
    const [currentColor,setCurrentColor] = useState(step.data.bg);
    const [annotationStatus,setStatus] = useState(step.data.annotationStatus);

    const copyHightlight=(copyAll)=>{
        setCopy(true)
        const value =copyAll? (data.text + '\n' + data.tip):data.text;
        writeTextToClipboard(value);
        setTimeout(()=>{
            setCopy(false)
        },3000)
    };

    function onchangeColor(color) {
        setCurrentColor(color);
        step.data.bg = color;
    }
    function changeAnnotationStatus() {
        if(data.annotationStatus === AnnotationStatus.SHOW){
            data.annotationStatus = AnnotationStatus.HIDE;
            data.lightStatus = LightStatus.UN_LIGHT;
        } else {
            data.annotationStatus = AnnotationStatus.SHOW;
            data.lightStatus = LightStatus.LIGHT;
        }
    }

    step.addListener(function () {
        setStatus(step.data.annotationStatus);
    },false,'actions')

    const pin = annotationStatus === AnnotationStatus.SHOW;

    return(
        <Fragment>
            <pagenote-icon aria-controls='pin' data-status={pin?'pin':''} onClick={changeAnnotationStatus}>
                <PinIcon fill={pin ? currentColor : '#fff'} />
            </pagenote-icon>
            <Tip message={i18n.t(copied?'copied':'copy_keyword_annotation')}>
                <pagenote-icon onClick={()=>copyHightlight(false)}
                               onDblClick={()=>{copyHightlight(true)}}>
                    <CopyIcon fill={currentColor}  width={20} height={20}  />
                </pagenote-icon>
            </Tip>
            <Tip message={i18n.t('comment')}>
                <pagenote-icon onClick={()=>{
                    step.openEditor();
                }}>
                    <NoteIcon fill={currentColor} width={20} height={20}/>
                </pagenote-icon>
            </Tip>
            <Tip message={i18n.t('change_color')}>
                <Colors colors={colors} current={currentColor} selectColor={onchangeColor}></Colors>
            </Tip>
            <Tip message={i18n.t('remove_marks')}>
                <pagenote-icon aria-controls="delete-icon">
                    <DeleteIcon  width={20} height={20} fill={currentColor}  onClick={()=>{step.delete()}} />
                </pagenote-icon>
            </Tip>
        </Fragment>
    )
}

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
        <pagenote-light-actions>
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
                } inner={true} placement='rightBottom' trigger='hover'
                >
                    <pagenote-icon aria-controls="more-icon">
                        <MoreIcon />
                    </pagenote-icon>
                </Popover>
            }
        </pagenote-light-actions>
        ,rootElement)
}
