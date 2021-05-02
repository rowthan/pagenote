import {h} from 'preact';
import Tip from "@/component/tip/Tip";
import i18n from "@/locale/i18n";
import CopyIcon from "@/assets/images/copy.svg";
import DeleteIcon from "@/assets/images/delete.svg";
import {writeTextToClipboard} from "@/utils/document";

export default function LightActionBar({step}) {

    const copyHightlight=(copyAll)=>{
        const value =copyAll? (step.text + '\n' + step.tip):step.text;
        writeTextToClipboard(value);
    };

    return(
        <pagenote-light-actions>
            <Tip message={i18n.t('copy_keyword_annotation')}>
                <pagenote-icon onClick={()=>copyHightlight(false)}
                               onDblClick={()=>{copyHightlight(true)}}>
                    <CopyIcon fill={step.bg}  width={16} height={16}  />
                </pagenote-icon>
            </Tip>
            <Tip message={i18n.t('remove_marks')}>
                <pagenote-icon>
                    <DeleteIcon  width={16} height={16} fill={step.bg}  onClick={()=>{step.delete.call(step)}} />
                </pagenote-icon>
            </Tip>
        </pagenote-light-actions>
    )
}