import r2wc from "@r2wc/react-to-web-component"
import { withoutReAction } from "./components/HOC";
import LetMeKnow from "./components/LetMeKnow";
import Highlight from "./components/Highlight";

customElements.define("let-me-know", r2wc(withoutReAction(LetMeKnow),{
  shadow:'closed'
}))

customElements.define("high-light", r2wc(Highlight,{
  shadow:'closed'
}))

export default{
    LetMeKnow,
    Highlight,
}