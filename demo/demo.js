import { h, render,Component } from 'preact';
import PageNote from "../src/pagenote";
import './demo.scss'

// new 对象
const pagenote = new PageNote('dev',{
  saveInLocal: true,
  shortCuts:'abcded',
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
  }]],
  sideBarActions:[
    {
      icon:'<svg t="1605332269443" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6539" width="20" height="20"><path d="M512.140705 379.234207c-82.390475 0-149.126412 66.734914-149.126412 149.127436s66.735937 149.127436 149.126412 149.127436c82.392522 0 149.128459-66.735937 149.128459-149.127436S594.532203 379.234207 512.140705 379.234207z" p-id="6540" fill="#ffffff"></path><path d="M874.146529 304.669978 766.396479 304.669978c-14.907525 0-30.944779-28.708855-35.789111-42.87039l-32.057113-68.975954c-4.843308-14.161534-22.372543-37.282115-37.282115-37.282115L363.014292 155.541519c-14.908548 0-32.803103 23.119557-37.282115 37.282115l-27.578102 71.960938c-4.861728 13.780865-20.518313 39.885406-35.426861 39.885406L154.594449 304.669978c-49.185212 0-89.836051 14.909571-89.836051 64.496943l0 404.877237c0 49.223075 40.650839 89.855494 89.836051 89.855494l719.553103 0c49.589418 0 85.378529-40.632419 85.378529-89.855494L959.526081 369.166921C959.525058 319.579549 923.735947 304.669978 874.146529 304.669978zM512.140705 752.053308c-123.402541 0-223.689618-100.285031-223.689618-223.691665 0-123.404588 100.287077-223.691665 223.689618-223.691665 123.408681 0 223.692688 100.287077 223.692688 223.691665C735.83237 651.768277 635.548362 752.053308 512.140705 752.053308z" p-id="6541" fill="#ffffff"></path></svg>',
      name:'侧边栏自定义',
      onclick: function (e) {
        pagenote.capture();
      },
    }
  ],
  categories:[{
    label:'候选项1'
  },{
    label:'候选项2'
  }]
});

class Foo extends Component{
  constructor(props){
    super(props);
    // 初始化
    pagenote.init();
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
              </div>
              <div>
                <video controls="controls" width={400} src="https://pagenote.cn/pagenote.mp4"></video>
              </div>
              <div className='en'>
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
      </div>
    )
  }
};

const root = document.getElementById('guide');

render(<Foo />, root);
