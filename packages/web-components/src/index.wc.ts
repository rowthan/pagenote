import r2wc from "@r2wc/react-to-web-component"
import {WebComponent as Popup} from "./Popup";
import {WebComponent as Keyword} from './Keyword'
import {WebComponent as LetMeKnow} from "./LetMeKnow";


customElements.define("key-word", r2wc(Keyword,{
  shadow:'closed'
}))


customElements.define("pop-up", r2wc(Popup,{
  shadow:'closed'
}))

customElements.define("let-me-know", r2wc(LetMeKnow,{
  shadow:'closed'
}))
