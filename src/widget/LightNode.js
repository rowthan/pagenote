import { h, render,Component, Fragment} from 'preact';
import { useState,useEffect,useRef } from 'preact/hooks';
import ContentEditable from "react-contenteditable";
import style from './light-node.scss';
import {writeTextToClipboard} from '../document';
import {moveable} from "../document";
import DeleteIcon from '../assets/delete.svg';
import PinIcon from '../assets/pin.svg'
import ColorIcon from '../assets/color.svg';
import CommentIcon from '../assets/comment.svg';
import CopyIcon from '../assets/copy.svg';
import MoreIcon from '../assets/more.svg';
import whatsPure from "whats-element/pure";
const whats = new whatsPure();

export default class LightNode extends Component{
  constructor(props){
    super(props);
    this.state={
      showNote:false,
      isPin: false,
      showMore:false,
      tip:''
    }
  }

  componentDidMount() {
    this.setState({
      tip: this.props.light.tip,
    })
  }

  deleteLight=()=>{
    const light = this.props.light;
    light.delete.call(light);
  };

  doEditor=()=>{
    this.setState({
      showNote: true,
    },()=>{
      this.ref.el.current.focus();
    })
  };

  modifyTip = (e)=>{
    const value = e.target.value;
    this.setState({
      tip:value,
    });
    this.props.light.tip = value;
    this.props.light.save();
  };

  saveTip = ()=>{
    this.setState({
      showNote: false,
    })
  };

  setRef = (dom) => this.ref = dom;

  setDragAble =(dom) =>{
    const light = this.props.light;
    // 初始化 lightNode 的坐标
    const relativeNode = light.relatedNode[0];
    if(!relativeNode){
      return;
    }
    const relatedNodePosition = whats.compute(relativeNode);
    if(!relatedNodePosition){
      return;
    }
    const offsetX = light.offsetX<1?light.offsetX * relativeNode.offsetWidth:light.offsetX;
    const offsetY = light.offsetY<1?light.offsetY * relativeNode.offsetHeight: light.offsetY;
    let origin = {
      left: relatedNodePosition.left + offsetX,
      top: relatedNodePosition.top + offsetY,
    };
    light._position = {
      left: Math.max(origin.left,20),
      top: Math.max(20,origin.top),
    };
    if(dom){
      let saveTimer = null;
      moveable(dom,(e)=>{
        clearTimeout(saveTimer);
        const position = {
          left: Math.max(e.pageX-100,120),
          top: Math.max(e.pageY-12,50),
        };
        light._position = position;
        saveTimer = setTimeout(()=>{
          // 移动在可视范围内
          setValue(position,relatedNodePosition);
        },600)
      },false);

      function setValue(after,before) {
        const offsetX = after.left - before.left;
        const offsetY = after.top - before.top;
        light.offsetX = offsetX;
        light.offsetY = offsetY;
        light.save();
      }
    }
  };




  copyHightlight=(copyAll)=>{
    const value =copyAll? (this.props.light.text + '\n' + this.props.light.tip):this.props.light.text;
    writeTextToClipboard(value);
    this.props.pagenote.notification('已复制'+(copyAll?'关键词和笔记':'关键词'));
  };

  onChangeColor=(color)=>{
    const {light} = this.props;
    light.changeColor.call(light,color)
  };

  pinLight =(active)=>{
    const {light} = this.props;
    light.toggle.call(light,active,false);
    this.setState({
      isPin: active,
    })
  };

  toggleShowMore =()=>{
    this.setState({
      showMore: !this.state.showMore,
    })
  };

  render(props,state,) {
    const {showNote,isPin,tip,showMore} = state;
    const {light,pagenote} = props;
    const hasTip = !!light.tip;

    // 显示编辑器
    const showNoteEditor = ((light.isActive || light.isFocus)&&hasTip) || showNote;
    // 显示 操作icon
    const showIcons = light.isFocus || showNoteEditor || isPin;
    // 是否已pin
    const hasPin = (light.isActive&&light.tip) || isPin;
    // 限制 light-tag
    const isShow = showIcons || showNoteEditor || hasPin;
    return(
      <Fragment>
        {
          (isShow&&light.relatedNode)?<pagenote-light-tag
            className={`${style.lightAction} no-pagenote`}
            style={{
              position:'absolute',
              top:light._position?light._position.top:0,
              left:light._position? light._position.left:0,
            }}>
            {
              <div className={`${style.actions} ${showIcons?style.show:''}`}
                   ref={this.setDragAble}
                   style={{
                     borderColor: light.bg,
                     color: light.bg,
                   }}
              >
                {/*<DragIcon fill={light.bg} className={style.dragIcon}></DragIcon>*/}
                <pagenote-icon data-tip={hasPin?'隐藏':'固定'} className={`${style.pinIcon} ${hasPin?style.pin:''}`}>
                  <PinIcon onClick={()=>this.pinLight(!hasPin)} fill={hasPin?light.bg:'#eee'}  />
                </pagenote-icon>
                <pagenote-icon className={style.actionIcon} data-tip='单击复制划词，双击复制划词和批注'
                      onClick={()=>this.copyHightlight(false)} onDblClick={()=>{this.copyHightlight(true)}}>
                  <CopyIcon  fill={light.bg}  width={18} height={18}  />
                </pagenote-icon>
                <pagenote-icon data-tip='批注' className={style.actionIcon} onClick={this.doEditor}>
                  <CommentIcon  fill={light.bg}  width={18} height={18}  />
                </pagenote-icon>
                <pagenote-icon data-tip='变更颜色' className={style.actionIcon} >
                  <Colors colors={pagenote.options.colors} current={light.bg} selectColor={this.onChangeColor}></Colors>
                </pagenote-icon>

                <pagenote-icon className={`${style.actionIcon} ${style.deleteIcon}`} data-tip='清空标记'>
                  <DeleteIcon  width={18} height={18} fill={light.bg}  onClick={this.deleteLight} />
                </pagenote-icon>
                <pagenote-icon className={`${style.moreIcon}`} data-tip='展开更多'>
                  <MoreIcon fill={showMore?light.bg:'#999'}  width={18} height={18} onClick={this.toggleShowMore} />
                </pagenote-icon>


                {
                  showMore &&
                  <div className={style.moreInfo}>
                    <span>{new Date(light.time).toLocaleString()}</span>
                  </div>
                }
              </div>
            }
            <ContentEditable
              ref={this.setRef}
              className={`${style.note} ${showNoteEditor?style.showNote:''}`}
              html={tip} // innerHTML of the editable div
              disabled={false} // use true to disable edition
              onChange={this.modifyTip} // handle innerHTML change
              onBlur={this.saveTip}
            />
          </pagenote-light-tag>:
           <pagenote-light-tag />
          }
      </Fragment>
    )
  }
}

const Colors = function ({colors,current,selectColor}) {
  const [show,setShow] = useState(false);
  const setColor = function (color) {
    selectColor(color);
  };
  return(
    <div className={style.colors}>
      {
        show &&
        <div className={style.colorOptions}>
          {
            colors.map((color)=>{
              return <div onClick={() => {
                setColor(color)
              }}
                          className={`${style.colorItem} ${color === current ? style.active : ''}`}
                          style={{backgroundColor: color}}></div>
            })
          }
        </div>
      }
      <div className={style.currentColor} onClick={()=>setShow(true)}>
        <ColorIcon width={18} height={18} fill={current}/>
      </div>
    </div>
  )
};
