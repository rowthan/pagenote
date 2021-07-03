import {h, Component, Fragment} from 'preact';
import BigPicture from "bigpicture";
import i18n from '@/locale/i18n';
import { BAR_STATUS } from '@/const';
import {moveable} from "@/utils/document";
import RemoveIcon from '@/assets/images/remove.svg';
import Toggle from '@/assets/images/toggle.svg';
import ExpandIcon from '@/assets/images/expand.svg';
import LightRefAnotation from "./LightRefAnotation";
// import ScrollProgress from "./ScrollProgress";
import sideStyle from './aside.scss';
import LightIcon from './LightIcon'
import Tip from "../tip/Tip";
import LightActionBar from "@/component/LightActionBar";
import Tags from "./Tags";

let lastTop = -1;
let pagenote = null;
function computeTop(top) {
    const containerHeight = window.innerHeight-30-16;
    let result = top/document.documentElement.scrollHeight * containerHeight + 30+16;

    result = Math.min(top,result,containerHeight);

    if( lastTop>0 && Math.abs(result-lastTop)<24){ // 同一行最多可以展示同样y值的4个，否则会被覆盖
        result = lastTop + 16;
    }
    lastTop = result;
    return result
}
class AsideBar extends Component{
    constructor(props) {
        super();
        pagenote = this.pagenote = props.pagenote;
        this.toggleAllLight = this.toggleAllLight.bind(this);
        this.toggleAutoLight = this.toggleAutoLight.bind(this);
        this.replay = this.replay.bind(this);
        this.toggleSideBar = this.toggleSideBar.bind(this);
        this.state={
            barInfo:pagenote.runningSetting.barInfo,
            steps: pagenote.recordedSteps,
            snapshots: pagenote.snapshots || [],
            categories: pagenote.categories,
            note: pagenote.note,
            autoLight: pagenote.runningSetting.autoLight,
            highlightAll: pagenote.highlightAll,
            runindex: pagenote.runindex,
            capturing: false,

            title: pagenote.plainData.title,

            run: false,
            lastFocus: '',

            allStepStatus: 0,
        };
        pagenote.addListener(this.refreshStatus.bind(this));
    }

    refreshStatus(){
        this.setState({
            barInfo:pagenote.runningSetting.barInfo,
            steps: pagenote.recordedSteps || [],
            categories: pagenote.categories,
            note: pagenote.note || '',
            snapshots: pagenote.snapshots || [],
            autoLight: pagenote.runningSetting.autoLight || false,
            highlightAll: pagenote.highlightAll || false,
            runindex: pagenote.runindex,
            status: pagenote.status,

            title: pagenote.plainData.title,

            run: [pagenote.CONSTANT.REPLAYING,pagenote.CONSTANT.START_SYNC].includes(pagenote.status)
        })
    }

    toggleAllLight(){
        const pagenote = this.pagenote;
        const nextStatus = this.state.allStepStatus + 1;
        const finalStatus = nextStatus > 2 ? 0 : nextStatus;
        pagenote.recordedSteps.forEach((light)=>{
            light.changeData({
                lightStatus: finalStatus,
                annotationStatus: finalStatus === 2 ? 1: 0,
            })
        });
        this.setState({
            allStepStatus: finalStatus
        })
    };

    toggleAutoLight(){
        const pagenote = this.pagenote;
        pagenote.runningSetting.autoLight = !pagenote.runningSetting.autoLight;
        pagenote.makelink();
    };


    replay() {
        this.pagenote.replay(...arguments);
        this.refreshStatus();
    }

    changeLightStatus(index) {
        this.pagenote.replay(index,true, true, false,true);
        this.pagenote.recordedSteps[index].writing = true;
        this.refreshStatus();
    }

    toggleSideBar() {
        let newStatus = this.state.barInfo.status || '';
        const barInfo = this.pagenote.runningSetting.barInfo;
        if(newStatus===BAR_STATUS.expand){
            newStatus = BAR_STATUS.fold
        } else {
            newStatus = BAR_STATUS.expand;
        }
        barInfo.status = newStatus;

        this.pagenote.makelink();
    }


    setRef(dom){
        const pagenote = this.pagenote;
        if(this.sideEl){
            return;
        }
        this.sideEl = dom;
        let timer = null;
        moveable(dom, (e)=> {
                const x = e.clientX+50;
                const y = e.clientY-10;
                const origin = pagenote.runningSetting.barInfo;
                origin.right = Math.max(1,(document.documentElement.clientWidth-x-10));
                origin.right = Math.min(origin.right,document.documentElement.clientWidth-20);
                origin.top = Math.max(Math.min(document.documentElement.clientHeight-200, y),0);
                clearTimeout(timer);
                timer = setTimeout(()=>{
                    pagenote.makelink();
                },600);
                this.setState({
                    barInfo:pagenote.runningSetting.barInfo,
                })
        },false)
    }

    confirmShare(){
        this.pagenote.options.onShare(this.pagenote);
    }

    toggleHideSideBar(){
        let newStatus = this.state.barInfo.status || '';
        if(newStatus.indexOf(BAR_STATUS.expand)>-1){
            newStatus= BAR_STATUS.fold
        } else {
            newStatus = BAR_STATUS.expand;
        }
        const barInfo = this.pagenote.runningSetting.barInfo;
        barInfo.status = newStatus;
        this.setState({
            barInfo:barInfo,
        });
        this.pagenote.makelink();
    }


    setCategories = (categories)=>{
        this.pagenote.categories = categories
        this.pagenote.makelink();
    };

    bigPicture(e,snapshot,gallery=[],index=0){
        BigPicture({
            el: e.target,
            // imgSrc: snapshot,
            gallery: gallery,
            position:index,
            animationEnd: function() {
            },
        });
    }

    removeSnapshot=(index)=>{
        this.pagenote.snapshots.splice(index,1);
        this.pagenote.makelink()
    };

    capture =()=>{
        this.pagenote.capture();
        this.setState({
            capturing: true,
        },()=>{
            setTimeout(()=>{
                this.setState({
                    capturing: false,
                })
            },3000)
        })
    };

    setLastFocus =(info)=>{
        this.setState({
            lastFocus: info,
        })
    }

    render() {
        const {
            status,barInfo,steps,runindex,categories,snapshots,run
        } = this.state;
        const barStatus = barInfo.status||'';
        const isExpand = false;//barStatus === BAR_STATUS.expand;
        const showBar = steps.length > 0 || snapshots.length > 0;
        const top = isExpand?0:barInfo.top;
        barInfo.right = Math.min(document.documentElement.clientWidth-200,barInfo.right);
        let right = Math.max(barInfo.right,0);

        const actions = this.pagenote.options.sideBarActions;

        let colorSet = new Set();
        steps.forEach((step)=>{
            colorSet.add(step.lightBg||step.bg);
        });

        const targets = document.querySelectorAll(`pagenote-light-aside-item[data-insign="1"][data-focus="1"]`);
        const inViewTargets =  document.querySelectorAll(`pagenote-light-aside-item[data-insign="1"]`);

        const target = targets[Math.floor(targets.length/2)] || inViewTargets[Math.floor(inViewTargets.length/2)];

        const topMask = target ? target.offsetTop : 0;
        const heightMask = target ? 28 : 0;


        return(
            status===this.pagenote.CONSTANT.DESTROY ? '' :
            <>
                {
                    showBar &&
                    <pagenote-aside data-status={isExpand?'expand':'fold'} style={{right: right + 'px', top: top + 'px',position:'fixed'}}>
                        <pagenote-actions ref={this.setRef.bind(this)}>
                            <Tip message={i18n.t('toggle_marks')}>
                                <pagenote-action onClick={this.toggleAllLight} >
                                    <LightIcon run={run}  colors={steps.map((s)=>s.bg)} />
                                </pagenote-action>
                            </Tip>

                            <pagenote-action-group>
                                {actions.length}
                                {
                                    actions.map((action,index)=>
                                      <Tip message={action.name}>
                                          <pagenote-action
                                              key={action.name+index}
                                               onClick={action.onclick}
                                               style={{ backgroundImage: `url(data:image/svg+xml;base64,${window.btoa(action.icon)})`, }}
                                          />
                                      </Tip>
                                      )
                                }
                            </pagenote-action-group>

                            {/*<pagenote-action data-action='toggle' onClick={this.toggleHideSideBar.bind(this)}>*/}
                            {/*    {isExpand ? <ExpandIcon />:  <Toggle />}*/}
                            {/*</pagenote-action>*/}

                        </pagenote-actions>

                        {/*<ScrollProgress useDot={isExpand} steps={steps} />*/}

                        {/*标记*/}
                        <pagenote-lights>
                            {/*{*/}
                            {/*    isExpand ? '' : <pagenote-light-aside-mask style={{*/}
                            {/*        height: heightMask,*/}
                            {/*        top: topMask*/}
                            {/*    }} />*/}
                            {/*}*/}

                            {
                                steps.map((record, index) => (
                                  <StepSign
                                    key={record.lightId}
                                    step={record}
                                    index={index}
                                    running={index === runindex}
                                    dot={isExpand}
                                    lastFocusId={this.state.lastFocus}
                                    colors={this.pagenote.options.brushes.map((brush)=>{return brush.bg})}
                                    onClick={(e)=>{
                                      const target = e.currentTarget;
                                      this.setLastFocus(record.lightId)
                                      // setTimeout(()=>{
                                      //     console.log(e.currentTarget,target)
                                      //     this.setLastFocus({
                                      //         lightId: record.lightId,
                                      //         height: target.offsetHeight,
                                      //         top: target.offsetTop,
                                      //     })
                                      // },1000)
                                    }}
                                  />
                                ))
                            }
                        </pagenote-lights>

                        <pagenote-infos>
                            <Tags allTags={this.pagenote.options.categories}
                                  initTagSets={categories}
                                  onchange={(values)=>{this.setCategories(values)}} />
                            <pagenote-snapshots>
                                {
                                    snapshots.map((img,index)=>(
                                        <pagenote-snapshot>
                                            <pagenote-icon>
                                                <RemoveIcon onClick={()=>this.removeSnapshot(index)} className={sideStyle.removeIcon}/>
                                            </pagenote-icon>
                                            <img onClick={(e)=>{
                                                this.bigPicture(e,img,snapshots.map((s)=>{
                                                    return {
                                                        src:s,
                                                    }
                                                }),index)
                                            }} src={img} alt=""/>
                                        </pagenote-snapshot>
                                    ))
                                }
                            </pagenote-snapshots>
                        </pagenote-infos>
                    </pagenote-aside>
                }
            </>
        )
    }
}


function StepSign({step,running=false,index,dot,lastFocusId,onClick,colors}) {
    const changeLevel = function (level) {
        step.level = level;
        step.save.call(step)
    }

    function toggleLight() {
        const nextStatus = step.data.lightStatus + 1;
        step.changeData({
            lightStatus: nextStatus > 2 ? 0 : nextStatus,
            annotationStatus: nextStatus === 2 ? 1 :0,
        })
    }

    const isActive = step.data.lightStatus > 0;
    const isVisible = step.runtime.isVisible;
    const {tip,bg} = step.data;
    return (
        <pagenote-light-aside-item
            data-active={isActive?'1':'0'}
            data-insign={isVisible?'1':''}
            data-level={1}
            data-dot={dot?'1':'0'}
            data-running={running}
            onClick={onClick}
            data-focus={lastFocusId===step.lightId?'1':'0'}
            style={{
                top: dot? computeTop(step.y, index) + "px" : 'unset',
                '--color': bg,
                '--shadow-color': dot? '#d8d8d8' : (tip ? bg : ''),
                position: dot ? 'absolute' : 'relative'
            }}
        >

            <pagenote-light-aside-item-container>
                <LightRefAnotation step={step} />
            </pagenote-light-aside-item-container>
            <pagenote-light-anotation>
                {
                    step.tip &&
                    <pagenote-block dangerouslySetInnerHTML={{__html: step.tip}}>

                    </pagenote-block>
                }
            </pagenote-light-anotation>
            <pagenote-light-aside-item-sign data-level={1} onClick={toggleLight} />
            <pagenote-light-actions-container>
                {/*<pagenote-light-aside-item-sign data-switch='1' data-level={step.level===1?2:1} onClick={()=>{changeLevel(step.level===1?2:1)}} />*/}
                <LightActionBar step={step} colors={colors} />
            </pagenote-light-actions-container>
        </pagenote-light-aside-item>
    )
}

export default AsideBar;
