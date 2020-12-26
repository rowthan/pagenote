import {h, Component, Fragment} from 'preact';
import BigPicture from "bigpicture";
import style from "./widget.scss";
import { BAR_STATUS } from '../const';
import {moveable} from "../document";
import RemoveIcon from '../assets/remove.svg';
import Toggle from '../assets/toggle.svg';
import Link from '../assets/link.svg'
import DropLabel from '../component/DropLabel';
import sideStyle from './aside-bar.scss';
import LightIcon from '../component/LightIcon'
import ExpandIcon from '../assets/expand.svg';
import LightRefAnotation from "../component/LightRefAnotation";
import ScrollProgress from "../component/ScrollProgress";
import i18n from '../locale/i18n';

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
        this.openMe = this.openMe.bind(this);
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
        pagenote.toggleAllLight();
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

    openMe(){
        window.open(`https://pagenote.cn/me`,'me')
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


    setCategories = (category,method='add')=>{
        if(method==='add'){
            if(this.pagenote.categories.size>=5){
                this.pagenote.notification(i18n.t('most_cnt',[5]));
                return;
            }
            this.pagenote.categories.add(category);
        } else if(method==='delete') {
            this.pagenote.categories.delete(category);
        }
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

    render() {
        const {
            status,barInfo,steps,autoLight,highlightAll,runindex,categories,note='',snapshots,capturing,title,run
        } = this.state;
        const barStatus = barInfo.status||'';
        const easyMode = barStatus === 'hide';
        const isExpand = barStatus === BAR_STATUS.expand;
        const isFold = barStatus === BAR_STATUS.fold;
        const showBar = steps.length > 0 || snapshots.length > 0;
        const top = isExpand?0:barInfo.top;
        barInfo.right = Math.min(document.documentElement.clientWidth-60,barInfo.right);
        let right = barInfo.right;

        const actions = this.pagenote.options.sideBarActions;

        let colorSet = new Set();
        steps.forEach((step)=>{
            colorSet.add(step.lightBg||step.bg);
        });
        return(
            status===this.pagenote.CONSTANT.DESTROY ? '' :
            <>
                {
                    showBar &&
                    <pagenote-aside data-status={isExpand?'expand':'fold'} style={{right: right + 'px', top: top + 'px',position:'fixed'}}>
                        <pagenote-actions ref={this.setRef.bind(this)}>
                            <pagenote-action onClick={this.toggleAllLight} data-tip={i18n.t('toggle_marks')}>
                                <LightIcon run={run}  colors={Array.from(colorSet)} />
                            </pagenote-action>
                            <pagenote-action-group>
                                {
                                    actions.map((action,index)=>
                                      <pagenote-action key={action.name+index}
                                                       data-tip={action.name}
                                                       onClick={action.onclick}
                                                       style={{ backgroundImage: `url(data:image/svg+xml;base64,${window.btoa(action.icon)})`, }}
                                      />)
                                }
                            </pagenote-action-group>

                            <pagenote-action data-action='toggle' data-tip={isExpand?i18n.t('expand'):i18n.t('fold')} onClick={this.toggleHideSideBar.bind(this)}>
                                {isExpand ? <ExpandIcon />:  <Toggle />
                                }
                            </pagenote-action>
                        </pagenote-actions>

                        <pagenote-description>
                            <pagenote-title>
                                {title}
                            </pagenote-title>
                            <pagenote-content>

                            </pagenote-content>
                        </pagenote-description>

                        {/*标记*/}
                        <pagenote-lights>
                            {
                                steps.map((record, index) => (
                                  <StepSign
                                    key={record.lightId}
                                    step={record}
                                    index={index}
                                    running={index === runindex}
                                    dot={isExpand}
                                  />
                                ))
                            }
                        </pagenote-lights>

                        {/*其他信息*/}
                        <pagenote-infos>
                            <DropLabel
                              onSet={this.setCategories}
                              categories={this.pagenote.options.categories}
                              currentCategories={categories}
                            />
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
                            <pagenote-link data-tip={i18n.t('goto_manage')} onClick={this.openMe}><Link /></pagenote-link>
                        </pagenote-infos>

                        <ScrollProgress useDot={isExpand} steps={steps} />
                    </pagenote-aside>
                }
            </>
        )
    }
}


function StepSign({step,running=false,index,barStatus,dot}) {
    return (
      <Fragment>
          {
              dot ?
                <pagenote-dot-container
                  data-active={step.isActive?'1':'0'}
                  data-running={running} style={{
                        top: computeTop(step.y, index) + "px",
                        '--color': step.bg,
                        position: 'absolute'
                    }}
                 onClick={()=>step.toggle()}>
                    <pagenote-light-ref-dot>
                        <LightRefAnotation step={step} />
                    </pagenote-light-ref-dot>
                    <pagenote-dot />
                </pagenote-dot-container>
                :
                <pagenote-line-container
                  data-active={step.isActive?'1':'0'}
                  style={{ '--color': step.bg, }}
                  onClick={()=>step.toggle()}
                >
                    <LightRefAnotation step={step} />
                </pagenote-line-container>
          }
      </Fragment>
    )
}

export default AsideBar;
