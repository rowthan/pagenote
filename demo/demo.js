import { h, render,Component } from 'preact';
import PageNote from "../src/pagenote";
import './demo.scss'
import en from '../src/locale/en.json';

// new 对象
const pagenote = new PageNote('dev',{
  saveInLocal: true,
  shortCuts:'abcded',
  enableMarkImg:true,
  functionColors:[[
    {
      icon:'<svg t="1604927420311" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3896" width="256" height="256"><path d="M641.5 649.2H381.4c-13.9-30.1-30.5-60.2-47-89.7-36.4-65.1-73.9-132.4-73.9-189 0-138.3 112.5-250.8 250.8-250.8s250.8 112.5 250.8 250.8c0 56.2-37.6 123.9-74 189.4-16.2 29.3-32.8 59.4-46.6 89.3z" fill="#EDF5F9" p-id="3897"></path><path d="M511.3 63.9c-169.3 0-306.6 137.2-306.6 306.6 0 112.4 102.8 231.4 140.2 336 55.8 156 49.6 249.3 166.3 249.3 118.4 0 110.5-92.9 166.3-248.6C715.2 602.3 817.9 482 817.9 370.5c0-169.3-137.2-306.6-306.6-306.6z m72.3 757.4l-138.2 17.3c-4.9-14.3-10.2-31-16.6-52.8l-0.3-0.9L601 763.4c-2.4 8.2-5.1 16.9-7.3 24.6-3.7 12.6-7 23.4-10.1 33.3z m-163.2-63.2c-5.1-16.8-10.8-34.5-17.2-53.2h216.4c-3.4 10-6.8 20-9.8 29.5l-189.4 23.7zM511.3 900c-28.2 0-41.2-3.2-55.7-34.8l118.1-14.8c-17 46.1-29.5 49.6-62.4 49.6z m130.2-250.8H381.4c-13.9-30.1-30.5-60.2-47-89.7-36.4-65.1-73.9-132.4-73.9-189 0-138.3 112.5-250.8 250.8-250.8s250.8 112.5 250.8 250.8c0 56.2-37.6 123.9-74 189.4-16.2 29.3-32.8 59.4-46.6 89.3z" fill="#144A8A" p-id="3898"></path><path d="M495.3 203.3c-92.2 0-167.2 75-167.2 167.2 0 7.7 6.2 13.9 13.9 13.9s13.9-6.2 13.9-13.9c0-76.8 62.5-139.4 139.4-139.4 7.7 0 13.9-6.2 13.9-13.9s-6.2-13.9-13.9-13.9zM583.6 821.3l-138.2 17.3c-4.9-14.3-10.2-31-16.6-52.8l-0.3-0.9L601 763.4c-2.4 8.2-5.1 16.9-7.3 24.6-3.7 12.6-7 23.4-10.1 33.3zM420.4 758.1c-5.1-16.8-10.8-34.5-17.2-53.2h216.4c-3.4 10-6.8 20-9.8 29.5l-189.4 23.7zM511.3 900c-28.2 0-41.2-3.2-55.7-34.8l118.1-14.8c-17 46.1-29.5 49.6-62.4 49.6z" fill="#9FC8E2" p-id="3899"></path></svg>',
      name:'自定义扩展1',
      shortcut: 'h',
      onclick: function (e,target) {
       alert('点击了')
      },
      onmouseover: function (e) {
        console.log('鼠标经过了',e)
      }
    }
  ],[{
    icon:'<svg t="1603375965274" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3171" width="48" height="48"><path d="M832.19 128H432.84c-35.43 0-64.14 28.72-64.14 64.14V320h64V192.14v-0.06c0.02-0.03 0.06-0.06 0.09-0.09h399.47c0.03 0.02 0.06 0.06 0.09 0.09v399.48c-0.02 0.03-0.06 0.06-0.09 0.09H703.33v64h128.86c35.43 0 64.14-28.72 64.14-64.14V192.14c0-35.42-28.72-64.14-64.14-64.14z" fill="#FFEB76" p-id="3172"></path><path d="M592.19 368H192.84c-35.43 0-64.14 28.72-64.14 64.14V831.5c0 35.43 28.72 64.14 64.14 64.14h399.35c35.43 0 64.14-28.72 64.14-64.14V432.14c0-35.42-28.72-64.14-64.14-64.14zM512 724H271.99v-64H512v64z m0-120H271.99v-64H512v64z" fill="#FFEB76" p-id="3173"></path><path d="M592.19 432h0.06c0.03 0.02 0.06 0.06 0.09 0.09v399.47c-0.02 0.03-0.06 0.06-0.09 0.09H192.78c-0.03-0.02-0.06-0.06-0.09-0.09V432.14v-0.06c0.02-0.03 0.06-0.06 0.09-0.09h399.41m0-63.99H192.84c-35.43 0-64.14 28.72-64.14 64.14V831.5c0 35.43 28.72 64.14 64.14 64.14h399.35c35.43 0 64.14-28.72 64.14-64.14V432.14c0-35.42-28.72-64.14-64.14-64.14z" fill="#333333" p-id="3174"></path><path d="M512 540H271.99v64H512v-64zM512 660H271.99v64H512v-64zM832.19 128H432.84c-35.43 0-64.14 28.72-64.14 64.14V320h64V192.14v-0.06c0.02-0.03 0.06-0.06 0.09-0.09h399.47c0.03 0.02 0.06 0.06 0.09 0.09v399.48c-0.02 0.03-0.06 0.06-0.09 0.09H703.33v64h128.86c35.43 0 64.14-28.72 64.14-64.14V192.14c0-35.42-28.72-64.14-64.14-64.14z" fill="#333333" p-id="3175"></path></svg>',
    name:'copy',
    shortcut: 'a',
    onclick: function (e,target) {
      alert('target');
      console.log(e,target)
    },
  },{
    icon:'https://avatars3.githubusercontent.com/u/10696733?s=64&v=4',
    name:'子扩展',
    onclick: function (e,target) {
      console.log(e,target)
    },
  }],[
    {
      type:'link',
      icon:'<svg t="1609077315684" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14615" width="16" height="16"><path d="M797.866667 298.666667h-51.2c-4.266667 0-8.533333 0-8.533334-4.266667l-196.266666-196.266667c-8.533333-8.533333-17.066667-12.8-25.6-12.8L213.333333 89.6c-72.533333 0-128 55.466667-128 128V797.866667C85.333333 874.666667 149.333333 938.666667 226.133333 938.666667h571.733334c76.8 0 140.8-64 140.8-140.8v-358.4C938.666667 362.666667 874.666667 298.666667 797.866667 298.666667zM170.666667 217.6c0-25.6 17.066667-42.666667 42.666666-42.666667l273.066667 4.266667c8.533333 0 12.8 4.266667 17.066667 8.533333L622.933333 298.666667H170.666667V217.6zM853.333333 810.666667c0 25.6-17.066667 42.666667-42.666666 42.666666H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666666v-384c0-21.333333 17.066667-38.4 38.4-42.666667H810.666667c21.333333 0 38.4 21.333333 38.4 42.666667v384z" fill="" p-id="14616"></path><path d="M298.666667 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="" p-id="14617"></path><path d="M298.666667 682.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="" p-id="14618"></path><path d="M725.333333 469.333333h-298.666666c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666667h298.666666c25.6 0 42.666667-17.066667 42.666667-42.666667s-21.333333-42.666667-42.666667-42.666667zM725.333333 640h-298.666666c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666666h298.666666c25.6 0 42.666667-17.066667 42.666667-42.666666s-21.333333-42.666667-42.666667-42.666667z" fill="" p-id="14619"></path></svg>',
      name:'素材抓取',
      onclick: function (e,target) {
        console.log(e,target)
      },
    }
  ]],
  showIconAnimation: false,
  sideBarActions:[
    {
      icon:'<svg t="1608973135144" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3309" width="32" height="32"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#E5EEFF" p-id="3310"></path><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m0-995.555556C244.622222 28.444444 28.444444 244.622222 28.444444 512s216.177778 483.555556 483.555556 483.555556 483.555556-216.177778 483.555556-483.555556S779.377778 28.444444 512 28.444444z" fill="#3D7CC4" p-id="3311"></path><path d="M477.866667 475.022222l-119.466667-159.288889c-5.688889-8.533333-5.688889-19.911111 2.844444-25.6 8.533333-5.688889 19.911111-5.688889 25.6 0l122.311112 145.066667 125.155555-145.066667c5.688889-8.533333 17.066667-8.533333 25.6-2.844444 8.533333 5.688889 8.533333 17.066667 2.844445 25.6l-119.466667 159.288889 73.955555 85.333333c42.666667-14.222222 88.177778 2.844444 108.088889 39.822222 22.755556 39.822222 14.222222 88.177778-19.911111 116.622223-34.133333 28.444444-82.488889 28.444444-116.622222 0-34.133333-28.444444-39.822222-79.644444-17.066667-116.622223 0 0 0-2.844444-2.844444-2.844444l-56.888889-76.8-34.133333-42.666667z m-22.755556 28.444445l34.133333 45.511111-36.977777 48.355555s0 2.844444-2.844445 2.844445c22.755556 36.977778 14.222222 88.177778-17.066666 116.622222-34.133333 28.444444-82.488889 28.444444-116.622223 0-34.133333-28.444444-42.666667-76.8-19.911111-116.622222 19.911111-39.822222 68.266667-56.888889 108.088889-39.822222l51.2-56.888889z m-73.955555 199.111111c19.911111-2.844444 36.977778-14.222222 45.511111-31.288889 8.533333-17.066667 5.688889-39.822222-5.688889-54.044445-11.377778-17.066667-31.288889-25.6-51.2-22.755555-28.444444 2.844444-51.2 31.288889-45.511111 59.733333 0 28.444444 25.6 51.2 56.888889 48.355556z m261.688888 0c19.911111 2.844444 39.822222-5.688889 51.2-22.755556 11.377778-17.066667 14.222222-36.977778 5.688889-54.044444-11.377778-28.444444-42.666667-39.822222-71.111111-28.444445-17.066667 8.533333-31.288889 25.6-31.288889 45.511111-2.844444 28.444444 17.066667 56.888889 45.511111 59.733334z" fill="#3D7CC4" p-id="3312"></path></svg>',
      name:'侧边栏自定义',
      onclick: function (e) {
        pagenote.capture();
      },
    },
    {
      icon:'<svg t="1609040292748" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11648" width="18" height="18"><path d="M507.787 0C231.351 0 7.314 229.127 7.314 511.854c0 282.711 224.037 511.853 500.473 511.853 276.436 0 500.473-229.142 500.473-511.853C1008.26 229.127 784.238 0 507.787 0z" fill="#7dc5eb" p-id="11649" data-spm-anchor-id="a313x.7781069.0.i14" class="selected"></path><path d="M668.672 500.838a20.114 20.114 0 0 1-28.965-27.75l34.992-36.615a79.053 79.053 0 0 0-7.636-107.608c-30.384-31.583-75.235-34.392-100.572-7.841L468.73 423.6a79.053 79.053 0 0 0 7.65 107.607 20.114 20.114 0 1 1-28.57 28.38 119.077 119.077 0 0 1-7.635-163.153l97.748-101.975c42.042-43.857 113.444-40.23 158.91 8.045a119.077 119.077 0 0 1 7.022 161.31l-35.182 37.01z" fill="#FFFFFF" p-id="11650"></path><path d="M333.97 507.275a20.114 20.114 0 0 1 28.965 27.765l-35.006 36.6a79.053 79.053 0 0 0 7.65 107.608c30.37 31.598 75.22 34.407 100.572 7.856l97.748-102.59a79.053 79.053 0 0 0-7.636-107.608 20.114 20.114 0 1 1 28.555-28.365 119.077 119.077 0 0 1 7.65 163.123l-97.762 101.99c-42.043 43.843-113.445 40.23-158.896-8.045a119.077 119.077 0 0 1-7.05-161.324l35.21-37.01z" fill="#FFFFFF" p-id="11651"></path></svg>',
      name:'在pagenote.cn中查看',
      onclick:function (){
        window.open(`https://pagenote.cn/me`,'me')
      }
    }
  ],
  categories:[{
    label:'候选项1'
  },{
    label:'候选项2'
  }]
});

pagenote.i18n.setLang('en',en);
pagenote.i18n.setLangType('en');

class Foo extends Component{
  constructor(props){
    super(props);
    // 初始化
    pagenote.init();
    console.log(pagenote)
  }

  render(){
    return(
      <div>
        <div className='demo'>
          <div className='guide'>
            <div className='content'>
              <div className='zh'>
                <p>
                  <a href='https://pagenote.cn' target='_blank'>PAGENOTE</a> 的初衷是为了能在网页里留一些笔记，能把账号、表单项的填写数据留在网页里，不必单独使用一个记事本，随用随取，不打扰最有效。
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
                <div style={{backgroundImage:`url(https://avatars2.githubusercontent.com/u/897401?s=64&v=4)`}}>
                  北京的呢
                </div>
                <img id='icon' src="https://avatars2.githubusercontent.com/u/897401?s=64&v=4" alt="图表"/>
                第二张
                <img  src="https://avatars2.githubusercontent.com/u/897401?s=64&v=4" alt=""/>
                试试图片标记
              </div>
              <div>
                <video controls="controls" width={400} src="https://pagenote.cn/pagenote.mp4"></video>
              </div>
              <div className='en'>
                <img  src="https://avatars2.githubusercontent.com/u/897401?s=64&v=4" alt=""/>
                <p>
                  The original intention of PAGENNOTE is to leave some notes in the web page, and to keep the data of account number and form items in the web page.
                </p>
                <p>
                  It is not necessary to use a notepad alone. It is available when you use it, and it is most effective without disturbing.
                  You can also highlight the content of your attention and remind yourself the next time you open it.
                </p>
                <p>
                  This might be the easiest operation to take notes.
                </p>
                <p>
                  I have also collected some products of the same type before, but they are basically not in line with their requirements. There are several problems:
                  <ul>
                    <li>
                      Charges: most of the slightly easier to use need to charge
                    </li>
                    <li>
                      Need to log in: I just want to use a tool, but don’t want to register an account. Forced login is annoying
                    </li>
                    <li>
                      Weak function: the function is relatively single, and the operation is complicated, and the visual interference is too strong
                    </li>
                  </ul>
                </p>
                <p>
                  Did not find a suitable product, so PAGENOTE just appeared, if you also have the above problems, you can try to use PAGENOTE.If still not resolved, you can also contact us and provide your suggestions.
                </p>
                <p>
                  Using PAGENOTE is very simple, if you have not used it, you can try to follow the prompts on the right to understand how to operate.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="apiItem">
          <a name="method-setIcon"></a>
          <h4>setIcon</h4>

          <div className="summary"><span style="display: none; ">void</span>
            <span>chrome.browserAction.setIcon</span>(<span className="null"><span
              style="display: none; ">, </span><span>object</span>
                      <var><span>details</span></var></span>)
          </div>

          <div className="description">
            <p className="todo" style="display: none; ">Undocumented.</p>
            <p className="pd">设置browser
              action的图标。图标可以是一个图片的路径或者是从一个canvas元素提取的像素信息.。无论是<strong>图标路径</strong>还是canvas的 <strong>imageData</strong>，这个属性必须被指定。
            </p>

            <h4>Parameters</h4>
            <dl>
              <div>
                <div>
                  <dt>
                    <var>details</var>
                    <em>

                      <div style="display:inline">
                        (
                        <span className="optional" style="display: none; ">optional</span>
                        <span className="enum" style="display: none; ">enumerated</span>
                        <span id="typeTemplate">
                      <span style="display: none; ">
                        <a> Type</a>
                      </span>
                      <span>
                        <span style="display: none; ">
                          array of <span><span></span></span>
                        </span>
                        <span>object</span>
                        <span style="display: none; "></span>
                      </span>
                    </span>
                        )
                      </div>

                    </em>
                  </dt>
                  <dd className="todo">
                    Undocumented.
                  </dd>
                  <dd style="display: none; ">
                    Description of this parameter from the json schema.
                  </dd>
                  <dd style="display: none; ">
                    This parameter was added in version
                    <b><span></span></b>.
                    You must omit this parameter in earlier versions,
                    and you may omit it in any version. If you require this
                    parameter, the manifest key
                    <a href="manifest.html#minimum_chrome_version">minimum_chrome_version</a>
                    can ensure that your extension won't be run in an earlier browser version.
                  </dd>

                  <dd>
                    <dl>
                      <div>
                        <div>
                          <dt>
                            <var>imageData</var>
                            <em>

                              <div style="display:inline">
                                (
                                <span className="optional">optional</span>
                                <span className="enum" style="display: none; ">enumerated</span>
                                <span id="typeTemplate">
                      <span style="display: none; ">
                        <a> Type</a>
                      </span>
                      <span>
                        <span style="display: none; ">
                          array of <span><span></span></span>
                        </span>
                        <span>ImageData</span>
                        <span style="display: none; "></span>
                      </span>
                    </span>
                                )
                              </div>

                            </em>
                          </dt>
                          <dd className="todo" style="display: none; ">
                            Undocumented.
                          </dd>
                          <dd>图片的像素信息。必须是一个ImageData 对象(例如：一个canvas元素)。</dd>
                          <dd style="display: none; ">
                            This parameter was added in version
                            <b><span></span></b>.
                            You must omit this parameter in earlier versions,
                            and you may omit it in any version. If you require this
                            parameter, the manifest key
                            <a href="manifest.html#minimum_chrome_version">minimum_chrome_version</a>
                            can ensure that your extension won't be run in an earlier browser version.
                          </dd>

                          <dd>
                            <dl>
                              <div style="display: none; ">
                                <div></div>
                              </div>
                            </dl>
                          </dd>

                          <dd style="display: none; ">
                            <div></div>
                          </dd>

                        </div>
                      </div>
                      <div>
                        <div>
                          <dt>
                            <var>path</var>
                            <em>

                              <div style="display:inline">
                                (
                                <span className="optional">optional</span>
                                <span className="enum" style="display: none; ">enumerated</span>
                                <span id="typeTemplate">
                      <span style="display: none; ">
                        <a> Type</a>
                      </span>
                      <span>
                        <span style="display: none; ">
                          array of <span><span></span></span>
                        </span>
                        <span>string</span>
                        <span style="display: none; "></span>
                      </span>
                    </span>
                                )
                              </div>

                            </em>
                          </dt>
                          <dd className="todo" style="display: none; ">
                            Undocumented.
                          </dd>
                          <dd>图片在扩展中的的相对路径。</dd>
                          <dd style="display: none; ">
                            This parameter was added in version
                            <b><span></span></b>.
                            You must omit this parameter in earlier versions,
                            and you may omit it in any version. If you require this
                            parameter, the manifest key
                            <a href="manifest.html#minimum_chrome_version">minimum_chrome_version</a>
                            can ensure that your extension won't be run in an earlier browser version.
                          </dd>

                          <dd style="display: none; ">
                            <dl>
                              <div>
                                <div>
                                </div>
                              </div>
                            </dl>
                          </dd>

                          <dd style="display: none; ">
                            <div></div>
                          </dd>

                        </div>
                      </div>
                      <div>
                        <div>
                          <dt>
                            <var>tabId</var>
                            <em>


                              <div style="display:inline">
                                (
                                <span className="optional">optional</span>
                                <span className="enum" style="display: none; ">enumerated</span>
                                <span id="typeTemplate">
                      <span style="display: none; ">
                        <a> Type</a>
                      </span>
                      <span>
                        <span style="display: none; ">
                          array of <span><span></span></span>
                        </span>
                        <span>integer</span>
                        <span style="display: none; "></span>
                      </span>
                    </span>
                                )
                              </div>

                            </em>
                          </dt>
                          <dd className="todo" style="display: none; ">
                            Undocumented.
                          </dd>
                          <dd>可选参数，将设置限制在被选中的标签，当标签关闭时重置。</dd>
                          <dd style="display: none; ">
                            This parameter was added in version
                            <b><span></span></b>.
                            You must omit this parameter in earlier versions,
                            and you may omit it in any version. If you require this
                            parameter, the manifest key
                            <a href="manifest.html#minimum_chrome_version">minimum_chrome_version</a>
                            can ensure that your extension won't be run in an earlier browser version.
                          </dd>

                          <dd style="display: none; ">
                            <dl>
                              <div>
                                <div>
                                </div>
                              </div>
                            </dl>
                          </dd>

                          <dd style="display: none; ">
                            <div></div>
                          </dd>

                        </div>
                      </div>
                    </dl>
                  </dd>

                  <dd style="display: none; ">
                    <div></div>
                  </dd>

                </div>
              </div>
            </dl>

            <h4 style="display: none; ">Returns</h4>
            <dl>
              <div style="display: none; ">
                <div>
                </div>
              </div>
            </dl>

            <div style="display: none; ">
              <div>
                <h4>Callback function</h4>
                <p className="pd">
                  The callback <em>parameter</em> should specify a function
                  that looks like this:
                </p>
                <p className="pd">
                  If you specify the <em>callback</em> parameter, it should
                  specify a function that looks like this:
                </p>

                <pre>function(<span>Type param1, Type param2</span>) <span className="subdued">

                </span>;</pre>
                <dl>
                  <div>
                    <div>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            <p style="display: none; ">
              This function was added in version <b><span></span></b>.
              If you require this function, the manifest key
              <a href="manifest.html#minimum_chrome_version">minimum_chrome_version</a>
              can ensure that your extension won't be run in an earlier browser version.
            </p>
          </div>

        </div>
      </div>
    )
  }
};

const root = document.getElementById('guide');

render(<Foo />, root);
