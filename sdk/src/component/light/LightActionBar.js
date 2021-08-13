import { h, render,Component, Fragment} from 'preact';
import LightNode from "./LightNode";

export default class ActionBars extends Component{
  constructor(props){
    super(props);
    this.state={
      lights:[],
      position:{},
    }
  }

  componentDidMount() {
    this.props.pagenote.addListener(()=>{
      const lights = this.props.pagenote.recordedSteps;
      this.setState({
        lights: lights,
      });
    });


    let actionRoot = null;
    let lastFocusLight = [];
    let timer = null;
    const listenType = 'mousemove'; // 'mousemove'
    document.addEventListener(listenType, (e)=> {
      actionRoot =  actionRoot || document.querySelector('pagenote-tags');
      const isLight = e.target && e.target.tagName.toLowerCase()==='light';
      const isChild = (actionRoot && actionRoot.contains(e.target));

      clearTimeout(timer);

      if(isLight || isChild){
        if(e.target._light){
          lastFocusLight.forEach((item)=>{
            item.isFocus = false;
          });
          lastFocusLight = [];
          e.target._light.isFocus = true;
          lastFocusLight.push(e.target._light);
        }
      }else {
        timer = setTimeout(()=>{
          lastFocusLight.forEach((item)=>{
            item.isFocus = false;
          });
          lastFocusLight = [];
        },100)
      }
      this.setState({
        lights: this.props.pagenote.recordedSteps,
      })
    },{capture:true});

    document.addEventListener('click',(e)=>{
      const target = e.target;
      const parentTarget = e.target.parentNode;
      const light = target._light || ( parentTarget ? parentTarget._light : null );

      if(light){
        light.toggle(undefined,false)
      }
    },{capture:true});
  }

  render() {
    const {lights} = this.state;
    return(
      <Fragment>
        {
          lights.map((item)=>(
            <LightNode key={item.lightId} pagenote={this.props.pagenote} light={item} />
          ))
        }
      </Fragment>
    )
  }
}
