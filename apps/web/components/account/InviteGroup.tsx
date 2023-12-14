import GroupSvg from "../../assets/svg/account/group.svg";
import React, { useState } from "react";
import useUserInfo from "../../hooks/useUserInfo";
import Modal from "../Modal";
import CommonForm, {CommonFormField} from "../CommonForm";

const fields: CommonFormField[] = [{
    type: "text",
    name: 'inviteCode',
    options:{
        required: "请填写邀请语"
    },
    placeholder:"写一段简单的介绍"
}]
export default function InviteGroup() {
    const [user,refresh] = useUserInfo();
    const [showForm,setShowForm] = useState(true);
    //@ts-ignore
    const inviteCode = user?.profile?.inviteCode || ""

    function onSubmit() {

    }

    return(
        <div>
            <div
                className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
                                <span className="text-green-500">
                                    <GroupSvg className={"h-5 fill-current"}/>
                                </span>
                <span>邀请分享</span>
            </div>
            <div className="">
                <div>
                    将 PAGENOTE <a className={'link '} href={'https://pagenote.cn/invite?code='+inviteCode}>推荐给其他人</a>。
                    <button className={'btn btn-sm btn-outline'}>编辑推荐语</button>
                </div>
            </div>
            <Modal open={showForm} toggleOpen={setShowForm}>
                <div>
                    <CommonForm onSubmit={onSubmit} fields={fields} value={{inviteCode:inviteCode}}></CommonForm>
                </div>
            </Modal>
        </div>
    )
}
