import {h} from 'preact';
import Tip from "@/component/tip/Tip";
import i18n from "@/locale/i18n";
import CopyIcon from "@/assets/images/copy.svg";
import DeleteIcon from "@/assets/images/delete.svg";
import NoteIcon from '@/assets/images/note.svg';
import {writeTextToClipboard} from "@/utils/document";
import {useState} from "preact/hooks";
import {Colors} from "@/component/light/LightNode";
import style from "@/component/light/light-node.scss";

export default function LightActionBar({step,colors}) {
    const {data} = step;
    const [copied,setCopy] = useState(false)
    const copyHightlight=(copyAll)=>{
        setCopy(true)
        const value =copyAll? (data.text + '\n' + data.tip):data.text;
        writeTextToClipboard(value);
        setTimeout(()=>{
            setCopy(false)
        },3000)
    };

    return(
        <pagenote-light-actions>
            <Tip message={i18n.t(copied?'copied':'copy_keyword_annotation')}>
                <pagenote-icon onClick={()=>copyHightlight(false)}
                               onDblClick={()=>{copyHightlight(true)}}>
                    <CopyIcon fill={data.bg}  width={20} height={20}  />
                </pagenote-icon>
            </Tip>
            <Tip message={i18n.t('remove_marks')}>
                <pagenote-icon>
                    <DeleteIcon  width={20} height={20} fill={data.bg}  onClick={()=>{step.delete()}} />
                </pagenote-icon>
            </Tip>
            <Tip message={i18n.t('change_color')}>
                <Colors colors={colors} current={data.bg} selectColor={(color)=>{step.changeData({
                    bg: color,
                })}}></Colors>
            </Tip>
            <Tip message={i18n.t('comment')}>
                <pagenote-icon>
                    <NoteIcon fill={data.bg} width={20} height={20}/>
                </pagenote-icon>
            </Tip>
        </pagenote-light-actions>
    )
}