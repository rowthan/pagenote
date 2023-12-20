import r2wc from "@r2wc/react-to-web-component"
import {WebComponent as Popup} from "./Popup";
import {WebComponent as Keyword} from './Keyword'


customElements.define("key-word", r2wc(Keyword,{
  shadow:'closed'
}))


customElements.define("pop-up", r2wc(Popup,{
  shadow:'closed'
}))
