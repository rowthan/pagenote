import {h, Component, Fragment} from 'preact';
import Modali, { useModali } from 'modali';
import {DraggableAreasGroup} from 'react-draggable-tags';
import {useEffect, useRef, useState} from "preact/hooks";
import './tags.less'

const group = new DraggableAreasGroup();
const DraggableArea1 = group.addArea();

const App = ({allTags=[],initTagSets,onchange}) => {
    const inputRef = useRef(null);
    const [recommendTags,setRecommend] = useState([]);

    useEffect(()=>{
        const meta = document.querySelector('meta[name="keywords"]');
        if(meta){
            const keywords = meta.content || '';
            keywords.replaceAll(',',' ').replaceAll('，',' ');
            const keys = keywords.split(/\s/);
            setRecommend(keys)
        }
    },[])

    const [exampleModal, toggleExampleModal] = useModali({
        animated: true,
        title: '为当前页面添加标签',
        message:"当前",
    });

    const currentArray = Array.from(initTagSets).filter((item)=>{
        return !!item
    }).map((item)=>{
        return {
            id: item,
            content: item
        }
    })

    function addTag(input) {
        const value = typeof input === 'string' ? input : inputRef.current.value;
        if(value){
            initTagSets.add(value);
            onchange(initTagSets)
            inputRef.current.value = ''
        }
    }



    const optionTags = allTags.map((item)=>{
        if(typeof item === 'object'){
            return item.label
        }else{
            return item
        }
    })

    const displayRecommendTags = [...recommendTags,...optionTags].filter((tag)=>{
        return !initTagSets.has(tag)
    })

    return (
        <pagenote-block>
            <pagenote-tags onClick={toggleExampleModal}>
                {
                    currentArray.length ?
                    currentArray.map((tag)=>{
                        return(
                            <pagenote-tag>{tag.content}</pagenote-tag>
                        )
                    }):
                    <pagenote-span>
                        #
                    </pagenote-span>
                }
            </pagenote-tags>
            <Modali.Modal {...exampleModal}>
                <pagenote-block className="CrossArea">
                    <pagenote-block className="area current">
                        <pagenote-p>
                            已选标签
                        </pagenote-p>

                        <pagenote-block className='selected-area'>
                            {/*<UserGeneratedPills />*/}
                            <DraggableArea1
                                tags={currentArray}
                                render={({tag}) => (
                                    <div className="tag" key={tag.id}>
                                        {tag.content}
                                        <aside className='delete' onClick={()=>{
                                            initTagSets.delete(tag.id);
                                            onchange(initTagSets)
                                        }}></aside>
                                    </div>
                                )}
                                onChange={leftTags => {
                                    // setCurrentArray(leftTags);
                                    const tags = leftTags.map((item)=>{return item.content});
                                    const newSet = new Set(tags)
                                    onchange(newSet);
                                }}
                            />
                        </pagenote-block>

                    </pagenote-block>

                    <pagenote-block className="area rest">
                        <pagenote-p>
                            推荐标签
                        </pagenote-p>
                        {
                            displayRecommendTags.map((tag)=>(
                                <span onClick={()=>{addTag(tag)}} className='tag'>{tag}</span>
                            ))
                        }
                        {/*<DraggableArea2*/}
                        {/*    tags={leftTags}*/}
                        {/*    render={({tag}) => (*/}
                        {/*        <div className="tag" onClick={()=>{*/}
                        {/*            initTagSets.add(tag);*/}
                        {/*            onchange(initTagSets)*/}
                        {/*          }*/}
                        {/*        }>*/}
                        {/*            {tag.content}*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*    // onChange={rightTags => this.setState({rightTags})}*/}
                        {/*/>*/}
                        <pagenote-p style={{position:'relative'}}>
                            <input ref={inputRef} type="text" placeholder='添加新标签'
                                   onKeyUp={(e)=>{console.log(e);if(e.key==='Enter'){addTag()}}} />
                            <button onClick={addTag}>添加</button>
                        </pagenote-p>
                    </pagenote-block>
                </pagenote-block>
            </Modali.Modal>
        </pagenote-block>
    );
};

export default App;