import {type ReactNode, useState} from 'react';
import CommonForm from "../CommonForm";
import {bindTransition} from "../../service";
import useUserInfo from "../../hooks/useUserInfo";
import {toast} from "../../@/components/ui/use-toast";

interface Props {
    children?: ReactNode;
    onSuccess?: ()=>void
    price: number
}

export default function BindVipForm(props: Props) {
    const {children} = props;
  const [userInfo] = useUserInfo()
  const [state, setState] = useState<'success'|'fail'|'unset'|'loading'>('unset')
  function bindTransitionByUser(value: { recordId: string }) {
    if (!userInfo) {
      toast({
          title:'请先登录后，返回此页面'
      })
      window.open('https://pagenote.cn/signin.html')
      return
    }
    setState('loading')
    bindTransition(value.recordId, props.price || 40).then(function (res) {
      const success = res.data?.json?.success;
      setState(success?'success':'fail')
      toast({
          title: success ? '提交成功' : '提交失败',
          variant: success ? 'default' : 'destructive'
      })
      if (success) {
       props.onSuccess && props.onSuccess()
      }
    })
  }

  return (
        <div className="flex items-center min-h-fill">
            <div className={'m-auto'}>
                {
                    state ==='success' ?
                        <div>
                            提交成功，今日 <a href="/vip" className={'link'}>VIP</a> 已开通。请等待审核。
                        </div>:
                        <>
                            <div className={'text-sm mb-2 text-center'}>
                                <CommonForm
                                    loading={state == 'loading'}
                                    onSubmit={bindTransitionByUser}
                                    fields={[
                                        {
                                            label: '支付订单号',
                                            name: 'recordId',
                                            placeholder: '支付订单号或转账单号',
                                            options: {
                                                required: true
                                            }
                                        },
                                    ]}
                                    value={{recordId: ''}}
                                />
                            </div>
                            <div className={'text-xs text-center'}>
                                <p>
                                    为保障你的体验，提交后将立即启用一日VIP
                                </p>
                                <p>
                                    作者将在12小时内核准你提交的凭证，超过12小时未收到邮件通知，请在 <a href="/author" className={'link'}>微信</a>
                                    联系我。
                                </p>
                            </div>
                        </>
                }

            </div>
        </div>
  );
}

