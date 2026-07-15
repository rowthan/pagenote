import Profle from 'components/account/Profile'
import BasicLayout from 'layouts/BasicLayout'
import useWhoAmi from "../hooks/useWhoAmi";
import {useEffect} from "react";

export default function Account() {
  const [whoAmi] = useWhoAmi();

  useEffect(() => {
    if(whoAmi?.version){
      window.location.href = `${whoAmi?.origin}/pagenote.html`
    }
  }, [whoAmi]);

  return (
    <BasicLayout
      nav={false}
      title={'用户信息'}
      description={'我的PAGENOTE用户信息'}
    >
      <Profle />
    </BasicLayout>
  )
}
