import r2wc from "@r2wc/react-to-web-component"
import { withoutReAction } from "./HOC";
import LetMeKnow from "./LetMeKnow";
import Highlight from "./Highlight";


const WebComponent = withoutReAction(LetMeKnow)

customElements.define("let-me-know", r2wc(WebComponent,{
  shadow:'closed'
}))

customElements.define("high-light", r2wc(Highlight,{
  shadow:'closed'
}))

export {
  LetMeKnow,
  Highlight,
}