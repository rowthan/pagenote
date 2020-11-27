import { h } from 'preact';
import { useState,useEffect,useRef } from 'preact/hooks';
import  style from './droplabel.module.scss';

export default function DropLabels({categories=[{label:'default'}],onSelected,currentCategories,onSet}) {
    const [newCategory, setNewCategory] = useState('');
    const [show,setShow] = useState(false);
    const onChange = function (e) {
        setNewCategory(e.target.value.trim())
    };
    const fileInputEl = useRef(null);
    const onkeydown = function (e) {
        if(e.which===13){
            onSelectedLabel(fileInputEl.current.value.trim(),'add',true)
        }
        e.stopPropagation();
    };

    useEffect(() => {
        fileInputEl.current.focus();
    });

    const closeDrop = function () {
      setShow(false);
    };

    const onSelectedLabel = function (value,type='add',close=false) {
        if(close){
            setShow(false);
        }
        onSet(value,type);
    };

    const categoryList = categories.filter(function (category) {
        if(!newCategory){
            return true;
        }
        return category.label.indexOf(newCategory)>-1;
    });

    const displayCategories = Array.from(currentCategories);

    return(
        <div>
            <div onClick={()=>setShow(true)} className='category-title'>
                {currentCategories.size===0?
                    <span className='category-name'>添加一个标签</span>:''}
                {
                    displayCategories.map((item)=>(
                        <span className='category-name' >{item}</span>
                    ))
                }
            </div>
            <div className={`droplabel ${show?'show':'hide'}`} onBlur={()=>{setTimeout(()=>{onSelected()},400)}}>
                <div className="select-menu-header">
                    <span className="select-menu-title">为此页面添加一个标签</span>
                    <svg onClick={closeDrop} className="close-button" viewBox="0 0 16 16" version="1.1" width="16" height="16"
                         aria-hidden="true">
                        <path fillRule="evenodd"
                              d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                    </svg>
                </div>
                <div className="select-menu-filters">
                    <div className="select-menu-text-filter">
                        <input ref={fileInputEl} onKeyDown={onkeydown} onChange={onChange} value={newCategory} type="text" placeholder="搜索/新建一个标签" autoComplete="off" autoFocus="" />
                        {
                            newCategory &&
                            <button onClick={(e)=>{onSelectedLabel(newCategory,'add',true);e.stopPropagation();}} className='new-button'>新建并应用</button>
                        }
                    </div>
                </div>
                <div className='select-menu-list'>
                    {
                        displayCategories.map((currentLabel)=>(
                            <label
                                onClick={()=>onSelectedLabel(currentLabel,'delete',false)}
                                className="select-menu-item label-select-menu-item">
                                <svg className="select-menu-item-icon"
                                     viewBox="0 0 16 16" version="1.1" width="16" height="16"
                                     aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                                </svg>
                                {currentLabel}
                            </label>
                        ))
                    }
                    <div>
                        {
                            categoryList.map((category)=>(
                              !currentCategories.has(category.label) &&
                              <div onClick={()=>onSelectedLabel(category.label)}
                                   key={category.label}
                                   className='select-menu-item'>
                                  <label>
                                      {category.label}
                                  </label>
                              </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
