import Callback from 'components/auth/Callback'
import {AuthType} from "const/oauth";

export default function CallbackPage() {
  return (
    <div className="">
        <Callback authType={AuthType.GITHUB}/>
    </div>
  )
}
