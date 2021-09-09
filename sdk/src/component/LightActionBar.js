import {h} from 'preact';
import Tip from "@/component/tip/Tip";
import i18n from "@/locale/i18n";
import CopyIcon from "@/assets/images/copy.svg";
import DeleteIcon from "@/assets/images/delete.svg";
import NoteIcon from '@/assets/images/note.svg';
import {useState, useEffect, useCallback} from "preact/hooks";
import Colors from "@/component/Colors";
import "@/component/light/light-node.scss";

export default function LightActionBar({step,colors}) {
    const {data} = step;
    const [copied,setCopy] = useState(false);
    const [currentColor,setCurrentColor] = useState(step.data.bg);

    const copyHightlight=()=>{
        setCopy(true)
        setTimeout(()=>{
            setCopy(false)
        },3000)
    };

    function onchangeColor(color) {
        setCurrentColor(color);
        step.data.bg = color;
    }

    return(
        <pagenote-light-actions>
            <Tip inner={true} message={i18n.t(copied?'copied':'copy_keyword_annotation')}>
                <pagenote-icon onClick={()=>{step.copyToClipboard(false);copyHightlight()}}
                               onDblClick={()=>{step.copyToClipboard(true);copyHightlight()}}>
                    <CopyIcon fill={currentColor}  width={20} height={20}  />
                </pagenote-icon>
            </Tip>
            <Tip inner={true} message={i18n.t('comment')}>
                <pagenote-icon onClick={()=>{
                    step.openEditor();
                }}>
                    <NoteIcon fill={currentColor} width={20} height={20}/>
                </pagenote-icon>
            </Tip>
            <Tip inner={true} message={i18n.t('remove_marks')}>
                <pagenote-icon>
                    <DeleteIcon  width={20} height={20} fill={currentColor}  onClick={()=>{step.delete()}} />
                </pagenote-icon>
            </Tip>
            <Tip inner={true} message={i18n.t('change_color')}>
                <Colors colors={colors} current={currentColor} selectColor={onchangeColor}></Colors>
            </Tip>
        </pagenote-light-actions>
    )
}