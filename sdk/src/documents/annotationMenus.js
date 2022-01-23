import ReactDom from 'react-dom';
import React,{useState} from 'react'
import root from 'react-shadow';
import Tip from "../component/tip/Tip";
import i18n from "../locale/i18n";
import MoreIcon from '../assets/images/more.svg'
import CopyIcon from "../assets/images/copy.svg";
import DeleteIcon from "../assets/images/delete.svg";
import NoteIcon from '../assets/images/note.svg';
import PinIcon from '../assets/images/pin.svg';
import Popover from "../component/tip/Popover";
import styles from './annotationMenu.scss'
import {writeTextToClipboard} from "../utils/document";
import Colors from "../component/Colors";
import {AnnotationStatus, LightStatus} from "../common/Types";


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
        setCurrentColor(step.data.bg);
    },false,'actions')

    const pin = annotationStatus === AnnotationStatus.SHOW;

    return(
        <pagenote-span onClick={(e)=>{e.stopPropagation()}}>
            <Tip placement='top' inner={true} message={(!pin?i18n.t('pin'):i18n.t('un_pin'))+'[p]'}>
                <pagenote-icon inner={true} aria-controls='pin' data-status={pin?'pin':''} onClick={changeAnnotationStatus}>
                    <PinIcon fill={pin ? currentColor : '#fff'} />
                </pagenote-icon>
            </Tip>
            <Tip placement="bottom" inner={true} message={i18n.t(copied?'copied':'copy_keyword_annotation')+'[c]'}>
                <pagenote-icon onClick={()=>copyHightlight(false)}
                               onDblClick={()=>{copyHightlight(true)}}>
                    <CopyIcon fill={currentColor}  width={20} height={20}  />
                </pagenote-icon>
            </Tip>
            <Tip placement="top" inner={true} message={i18n.t('comment')+'[m]'}>
                <pagenote-icon onClick={()=>{
                    step.openEditor();
                }}>
                    <NoteIcon fill={currentColor} width={20} height={20}/>
                </pagenote-icon>
            </Tip>
            <Tip placement="top" inner={true} message={i18n.t('change_color')}>
                <Colors colors={colors} current={currentColor} selectColor={onchangeColor}></Colors>
            </Tip>
            <Tip placement="top" inner={true} message={i18n.t('remove_marks')}>
                <pagenote-icon aria-controls="delete-icon">
                    <DeleteIcon  width={20} height={20} fill={currentColor}  onClick={()=>{step.delete()}} />
                </pagenote-icon>
            </Tip>
        </pagenote-span>
    )
}

export default function renderAnnotationMenu(rootElement,setting) {
    const {light,colors,moreActions = []} = setting;

    function generateOnclick(fun) {
        if (typeof fun === 'function'){
            return function (e) {
                fun(light)
                e.stopPropagation();
            }
        }else{
            return function(e){
                e.stopPropagation();
            };
        }
    }

    // ReactDom.render(
    //     <div>
    //         <root.div>
    //             {/*<style type="text/css">{styles}</style>*/}
    //             <pagenote-menu>
    //                 <LightActionBar step={light} colors={colors}/>
    //                 {
    //                     moreActions.length>0 &&
    //                     <Popover message={
    //                         <pagenote-block>{
    //                             moreActions.map((item)=>(
    //                                 <pagenote-block
    //                                     data-role="more-action-item"
    //                                     onClick={generateOnclick(item.onclick)}>{item.text}</pagenote-block>
    //                             ))
    //                         }</pagenote-block>
    //                     } inner={true} placement='rightBottom' trigger='hover'
    //                     >
    //                         <pagenote-icon inner={true} aria-controls="more-icon">
    //                             <MoreIcon fill='#999'/>
    //                         </pagenote-icon>
    //                     </Popover>
    //                 }
    //             </pagenote-menu>
    //         </root.div>
    //     </div>
    //     ,rootElement)
}
