
// import React,{Component} from 'react'
import {h} from 'preact';
import './demo.scss'
export default function Demo() {
    return (
        <div>
            <div className='demo'>
                <div className='guide'>
                    <div className='content'>
                        <div className='zh'>
                            <p>
                                <a href='https://pagenote.cn'
                                   target='_blank'>PAGENOTE</a> 的初衷是为了能在网页里留一些笔记，能把账号、表单项的填写数据留在网页里，不必单独使用一个记事本，随用随取，不打扰最有效。
                                还可以把关注的内容高亮，下次打开时提醒自己。
                            </p>
                            <p>
                                这应该就是记笔记最简单的操作了吧。
                            </p>
                            <p>
                                在此之前也搜罗过一些同类型的产品，但基本都不太符合自己的要求，其中有几个问题是：
                                <ul>
                                    <li>
                                        收费：大多稍微好用一点的都需要收费
                                    </li>
                                    <li>
                                        需要登录：只想使用一个工具，并不想去注册账号，强制登录很烦人
                                    </li>
                                    <li>
                                        功能弱：功能比较单一，且操作复杂，视觉上干扰性太强
                                    </li>
                                </ul>
                            </p>
                            <p>
                                没有找到合适的产品，所以 PAGENOTE 就这么出现了，如果你也有以上问题，那么可以尝试使用PAGENOTE。如果仍旧没有解决，也可以联系我们，提供你的建议。
                            </p>
                            <p>
                                使用PAGENOTE非常简单，如果你还没有使用过，可以尝试按照右边的提示，了解操作方式。
                            </p>
                            <div
                                style={{backgroundImage: `url(https://avatars2.githubusercontent.com/u/897401?s=64&v=4)`}}>
                                北京的呢
                            </div>
                            <img id='icon' src="https://avatars2.githubusercontent.com/u/897401?s=64&v=4" alt="图表"/>
                            第二张
                            <img src="https://avatars2.githubusercontent.com/u/897401?s=64&v=4" alt=""/>
                            试试图片标记
                        </div>
                        <div>
                            <video controls="controls" width={400} src="https://pagenote.cn/pagenote.mp4"></video>
                        </div>
                        <div className='en'>
                            <img src="https://avatars2.githubusercontent.com/u/897401?s=64&v=4" alt=""/>
                            <p>
                                The original intention of PAGENNOTE is to leave some notes in the web page, and to keep
                                the data of account number and form items in the web page.
                            </p>
                            <p>
                                It is not necessary to use a notepad alone. It is available when you use it, and it is
                                most effective without disturbing.
                                You can also highlight the content of your attention and remind yourself the next time
                                you open it.
                            </p>
                            <p>
                                This might be the easiest operation to take notes.
                            </p>
                            <p>
                                I have also collected some products of the same type before, but they are basically not
                                in line with their requirements. There are several problems:
                                <ul>
                                    <li>
                                        Charges: most of the slightly easier to use need to charge
                                    </li>
                                    <li>
                                        Need to log in: I just want to use a tool, but don’t want to register an
                                        account. Forced login is annoying
                                    </li>
                                    <li>
                                        Weak function: the function is relatively single, and the operation is
                                        complicated, and the visual interference is too strong
                                    </li>
                                </ul>
                            </p>
                            <p>
                                Did not find a suitable product, so PAGENOTE just appeared, if you also have the above
                                problems, you can try to use PAGENOTE.If still not resolved, you can also contact us and
                                provide your suggestions.
                            </p>
                            <p>
                                Using PAGENOTE is very simple, if you have not used it, you can try to follow the
                                prompts on the right to understand how to operate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
