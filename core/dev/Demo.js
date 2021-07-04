
// import React,{Component} from 'react'
import {h} from 'preact';
import './demo.scss'
export default function Demo() {
    return (
        <div className='demo'>
            <article>
                <section>
                    <h2>
                        <span className="en">How About PAGENOTE</span>
                        <span> 你能用 PAGENOTE 做什么？ </span>
                    </h2>
                    <div className="block">
                        <div className='card'>
                            <h3>
                                高亮
                            </h3>
                            <div>
                                <div>
                                    多种颜色高亮网页
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                        <div className="part">
                            <h3>
                                怎么使用
                            </h3>
                            <p>
                                在这里勾选任意一段文本，然后按钮就会自动出来。点击后就高亮成功了。
                            </p>
                            <p>
                                高亮成功后，还可以记录笔记，下次访问网页，笔记也都还在
                            </p>
                        </div>
                    </div>
                    <div className="block">
                        <div className='card'>
                            <h3>
                                批注
                            </h3>
                            <div>
                                <div>
                                    高亮内容
                                </div>
                                <div>
                                    批注笔记
                                </div>
                            </div>
                        </div>
                        <div className="part">
                            <h3>
                                怎么使用
                            </h3>
                            <p>
                                在这里勾选任意一段文本，然后按钮就会自动出来。点击后就高亮成功了。
                            </p>
                            <p>
                                高亮成功后，还可以记录笔记，下次访问网页，笔记也都还在
                            </p>
                        </div>
                    </div>
                    <div className="block">
                        <div className='card'>
                            <h3>
                                整理
                            </h3>
                            <div>
                                <div>
                                    在本地就整理的创建的笔记
                                </div>
                            </div>
                        </div>
                        <div className="part">
                            <h3>
                                免登录、离线可用
                            </h3>
                            <p>
                                你不必注册账号就能管理你的数据，因为数据就在你本机。
                            </p>
                            <p>
                                服务器端不存储你的数据
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>
                        特有的操作小技巧
                    </h2>
                    <p>
                        这是 PAGENOTE 特有的特性，在其他同类产品，你可能找不到。
                    </p>
                    <div className="block">
                        <div className="card">
                            <h3>
                                延迟功能
                            </h3>
                            <div>
                                按住鼠标不放一段时间后，按钮才会出现。
                            </div>
                        </div>
                        <div className="part">
                            <p>
                                当你在网页上选中一段内容后，你安装的划词插件会立即出现按钮 -- 或许，这已经打扰到你。
                                <br/>
                                而 PAGENOTE 允许你灵活控制按钮是否出现：按住鼠标不松一定时间后，PAGENOTE 才会开始工作。
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>
                        PAGENOTE +
                    </h2>
                    <div className="block">
                        <div className="card">
                            <h3>
                                扩展划词
                            </h3>
                            <div>
                                除了高亮、笔记等核心功能。更多的扩展功能，支持个性化定制，划词之后，还可以做什么？搜索、翻译、发送，这些，在 PAGENOTE+ 中都可以实现。
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>
                        与其他同类产品优点是什么？
                    </h2>
                    <div className="block">
                        <div className="part">
                            <h3>
                                免费，开源
                            </h3>
                            <div>
                                基本的高亮标注等核心功能，都是免费的。不会刻意限制你使用它。
                            </div>
                        </div>
                        <div className="part">
                            <h3>

                            </h3>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>
                        PAGENOTE 起源？
                    </h2>
                    <div className="block">
                        <div className="part">
                            <h3>
                                网页里留笔记
                            </h3>
                            <div>
                                的初衷是为了能在网页里留一些笔记，能把账号、表单项的填写数据留在网页里，不必单独使用一个记事本，随用随取，不打扰最有效。
                                还可以把关注的内容高亮，下次打开时提醒自己
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <video controls="controls" width={400} src="https://pagenote.cn/pagenote.mp4"></video>
                </section>
            </article>
            {/*<div className='content'>*/}
            {/*    <div>*/}

            {/*    </div>*/}
            {/*    <div className='en'>*/}
            {/*        <img src="https://avatars2.githubusercontent.com/u/897401?s=64&v=4" alt=""/>*/}
            {/*        <p>*/}
            {/*            The original intention of PAGENNOTE is to leave some notes in the web page, and to keep*/}
            {/*            the data of account number and form items in the web page.*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*            It is not necessary to use a notepad alone. It is available when you use it, and it is*/}
            {/*            most effective without disturbing.*/}
            {/*            You can also highlight the content of your attention and remind yourself the next time*/}
            {/*            you open it.*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*            This might be the easiest operation to take notes.*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*            I have also collected some products of the same type before, but they are basically not*/}
            {/*            in line with their requirements. There are several problems:*/}
            {/*            <ul>*/}
            {/*                <li>*/}
            {/*                    Charges: most of the slightly easier to use need to charge*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    Need to log in: I just want to use a tool, but don’t want to register an*/}
            {/*                    account. Forced login is annoying*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    Weak function: the function is relatively single, and the operation is*/}
            {/*                    complicated, and the visual interference is too strong*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*            Did not find a suitable product, so PAGENOTE just appeared, if you also have the above*/}
            {/*            problems, you can try to use PAGENOTE.If still not resolved, you can also contact us and*/}
            {/*            provide your suggestions.*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*            Using PAGENOTE is very simple, if you have not used it, you can try to follow the*/}
            {/*            prompts on the right to understand how to operate.*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}
