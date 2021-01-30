import { h } from 'preact';
import { useState,useRef } from 'preact/hooks';
import i18n from '../locale/i18n'
import Popover from '../component/tip/Popover'
import  style from './droplabel.module.scss';

export default function DropLabels({categories=[{label:'default'}],onSelected,currentCategories,onSet}) {
    const [newCategory, setNewCategory] = useState('');
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

    const onSelectedLabel = function (value,type='add',close=false) {
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
            <Popover overlay={
                <div className='droplabel'>
                    <div className="select-menu-header">
                        <span className="select-menu-title">{i18n.t('add_a_category')}</span>
                    </div>
                    <div className="select-menu-filters">
                        <div className="select-menu-text-filter">
                            <input ref={fileInputEl} onKeyDown={onkeydown} onChange={onChange} value={newCategory} type="text" placeholder={i18n.t('search_or_create_category')} autoComplete="off" autoFocus="" />
                            {
                                newCategory &&
                                <button onClick={(e)=>{onSelectedLabel(newCategory,'add',true);e.stopPropagation();}} className='new-button'>{i18n.t('create_and_apply')}</button>
                            }
                        </div>
                    </div>
                    <div className='select-menu-list'>
                        {
                            displayCategories.map((currentLabel)=>(
                              <label
                                onClick={()=>onSelectedLabel(currentLabel,'delete',true)}
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
                                  <div onClick={()=>onSelectedLabel(category.label,'add',true)}
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
            }>
                <div className='category-title'>
                    {currentCategories.size===0?
                      <span className='category-name'>{i18n.t('add_a_category')}</span>:''}
                    {
                        displayCategories.map((item)=>(
                          <span className='category-name' >{item}</span>
                        ))
                    }
                </div>
            </Popover>
        </div>
    )
}
