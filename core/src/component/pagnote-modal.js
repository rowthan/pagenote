import {LitElement, html, css} from 'lit-element';

class PageNoteModal extends LitElement {
    static get properties() {
        return {
            copied: {type: Boolean},
            show: {type: Boolean},
            activeTab: { type: String},
            markdown: {type: String},
            showShare: {type: Boolean},
            user: {type: Object},
            creating: {type: Boolean},
            shareData: {type: Object},
            shareType: {type: String},
            errorMsg: {type: String},
        };
    }

    static get styles() {
        return css`
            .mask{
              position:fixed;
              z-index:999999;
              background:rgba(0,0,0,0.4);
              top:0;
              left:0;
              bottom:0;
              top:0;
              width: 100%;
              height: 100%;
            }
            a{
                cursor: pointer;
                color: #6CB0E4;
            }
            .hide{
              display:none;
            }
            .container{
                font-size:14px;
                color:#333;
                text-align:left;
                width: 400px;
                box-sizing: border-box;
                background: #fff;
                border: 1px solid #333;
                padding: 12px;
                position: fixed;
                top: 70px;
                left: calc(50% - 200px);
                z-index: 9999999;
                box-shadow: 3px 2px 0px #111;
            }
            .close{
                position: absolute;
                right: 10px;
                top: 0px;
                color: red;
            }
            .tabs{
                text-align: left;overflow: hidden;position: relative;
            }
            .tab-border{
                width: 100%;height: 1px;position: absolute;bottom: 0;background: #000;z-index: -1;
            }
            .tab{
                position:relative;
                padding: 2px;
                margin-right: 12px;
                display: inline-block;
                relative;
                background: #fff;
                cursor: pointer;
            }
            .tab.active{
                top: 1px;
                border: 1px solid;
            }
            .tab-content{
                display:none;
                margin: 12px 0;
                min-height:50px;
            }
            .tab-content.active{
                display:block;
            }
            .copy-button{
                background: red;
                color: #fff;
                border: none;
            }
    `;
    }

    constructor() {
        super();
        this.initData();
    }

    render() {
        if(!this.show){
            return ''
        }
        return html`
        <div class="mask">
            <div class="container">
                <a class="close" @click="${this.closeModal}">关闭</a>
                <div class="tabs">
                    ${this.showShare ? html`<span @click="${()=>this.changeTab('share')}" class="tab ${this.activeTab==='share'?'active':''}">分享&导出</span>`:''}
                    <span @click="${()=>this.changeTab('me')}" class="tab ${this.activeTab==='me'?'active':''}">pagenote 广场</span>
                    <div class="tab-border"></div>
                </div>
                <div class="contents">
                      <section class="tab-content ${this.activeTab==='share'?'active':''}">
                        <p>
                            <span>
                                ${this.user?html`hi,<b>${this.user.name}</b>`:''}
                            </span>分享内容将<strong>公开，所有人可见 <a href="https://pagenote.cn/why">why?</a></strong>。
                        </p>
                        <div>
                            <label><input @change="${()=>this.changeShareType('only-light')}" name="share-type" checked="${this.shareType==='only-light'?'checked':''}" type="radio">仅分享标记</label>
                            <label><input @change="${()=>this.changeShareType('all')}" name="share-type" checked="${this.shareType==='all'?'checked':''}" type="radio">分享标记&网页</label>
                        </div>
                        
                        <div class="${this.shareType==='only-light'?'show':'hide'}">
                            <textarea readonly style="width: 100%;height: 150px;box-sizing: border-box;">${this.markdown}</textarea>
                            <button class="copy-button" @click="${this.copyMd}">${this.copied?'已复制':'一键复制MD'}</button>
                        </div>
                        <div class="${this.shareType==='all'?'show':'hide'}">
                            <input id="share-title" style="box-sizing: border-box;width: 100%;margin: 8px 0;" type="text" value="${this.shareData.title||''}" placeholder="分享标题，一句话总结吧，让你的分享更有吸引力" />
                            <img style="max-height: 400px;max-width: 100%;" src="${this.shareData.snapshot}" alt="" />
                            <div style="font-size: 12px;color: red;" class="tip">标记、以及网页内容被分享后公开可见。<br>当前页有敏感信息，如账户信息时，请注意保密。谨慎分享。</div>
                        </div>
                        
                        ${this.creating ? html`<pagenote-loading top="25" />` : ''}
                        ${this.shareLink ? html`<div><a target="_blank" href="${this.shareLink}">${this.shareLink}</a><img src="https://pagenote.cn/qr.png" alt=""></div>`:''}
                        ${this.errorMsg ? html`<div>${this.errorMsg}<a target="_blank" href="https://pagenote.cn/why#create-error">为什么会失败？</a></div>`:''}
                        <div class="${(this.shareLink||this.creating)?'hide':''}" id="buttons" style="text-align: right;">
                         ${this.user?html`<button style="background-color: red;color: #fff;" @click="${this.createShare}">生成分享链接</button>`:html`<button @click="${this.doLogin}">登录后分享</button>`}
                          <button @click="${this.closeModal}">取消</button>
                        </div>
                    </section>
                    
                    <section class="tab-content ${this.activeTab==='me'?'active':''}">
                       ${this.user?html`hi,<b>${this.user.name}</b> <a @click="${this.doLogout}">退出</a>`:html`<a @click="${this.doLogin}">请登录</a>`}
                       <div>
                         更多内容请访问 <a target="_blank" href="https://pagenote.cn">pagenote主页</a>
                       </div>
                    </section>
                </div>
              </div>
        </div>
    `;
    }

    initData() {
        this.activeTab = this.activeTab || 'share';
        this.markdown = window.pagenote.generateMD();
        this.showShare = !!window.pagenote.options.onShare;
        this.user = window.pagenote._user;
        this.creating = this.creating || false;
        this.shareData = {};
        this.shareLink = this.shareLink || '';
        this.shareType = this.shareType || 'all';
        this.errorMsg = '';
        this.show = this.show || false;

        window.pagenote.makelink((data)=>{
            this.shareData = data;
        })
    }

    changeTab(tab) {
        this.activeTab = tab
    }

    closeModal(){
        this.show = false;
        this.parentNode.removeChild(this)
    }

    copyMd() {
        const text = this.markdown + '\n\n[使用pagenote生成](https://pagenote.cn)';
        try {
            this.copied = true;
            return  navigator.clipboard.writeText(text)
        } catch (e) {
            const textarea = document.createElement('textarea');
            textarea.textContent = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('Copy', false, null);
            document.body.removeChild(textarea)
            this.copied = true;
        }
    }

    doLogin() {
        const host = 'https://pagenote.cn?form=extension';
        const left = window.innerWidth/2 - 300;// ,'_blank',`width=666,height=666,top=0,left=${left},status=no,location=no`;
        const loginWindow=window.open(`https://github.com/login/oauth/authorize?scope=user%20public_repo&client_id=c4aae381097464aa1024&redirect_uri=${host}`);
        loginWindow.focus();
    }

    doLogout() {
        const host = 'https://pagenote.cn';
        const logoutWindow=window.open(`${host}/logout?form=extension`);
        logoutWindow.focus();
    }

    createShare() {
        this.creating = true;
        this.errorMsg = '';
        window.pagenote.makelink( (data)=> {
            this.shareData = data;

            const forShareData = JSON.parse(JSON.stringify(data));
            delete forShareData.snapshot;
            delete forShareData.images;

            if(this.shareType==='all'){
                const doc = document.documentElement.cloneNode(true);
                [].forEach.call(doc.querySelectorAll('script'),function (el) {
                    el.parentNode.removeChild(el);
                });
                [].forEach.call(doc.querySelectorAll('*[data-pagenote]'),function (el) {
                    el.parentNode.removeChild(el);
                });
                [].forEach.call(doc.querySelectorAll('pagenote-modal'),function (el) {
                    el.parentNode.removeChild(el);
                });
                [].forEach.call(doc.querySelectorAll('style[pagenote]'),function (el) {
                    el.parentNode.removeChild(el);
                });
                [].forEach.call(doc.querySelectorAll('iframe'),function (el) {
                    el.parentNode.removeChild(el);
                });
                [].forEach.call(doc.querySelectorAll('iframe'),function (el) {
                    el.parentNode.removeChild(el);
                });
                doc.querySelectorAll(`light[data-highlight]`).forEach((light)=>{
                    light.outerHTML = light.innerHTML;
                });
                forShareData.html = doc.outerHTML.replace(/\s+|\n/g,function(match){
                    return ' '
                });

                // 修改相对路径
                doc.querySelectorAll('link').forEach((s)=>{
                   let href =  s.getAttribute('href');
                   // 替换相对路径
                   if(/^\./.test(href)){
                        href = href.replace('./',window.location.pathname)
                   }
                   // 增加域名
                   if(!/^http/.test(href)){
                       s.setAttribute('href',window.location.protocol+'//'+window.location.host+href)
                   }
                });

                const userInputEl = this.renderRoot.querySelector('#share-title');
                forShareData.title = userInputEl.value || data.title;
            }

            window.pagenote.options.onShare(forShareData, (result)=> {
                this.creating = false;
                this.shareLink = result.shareLink;
                this.errorMsg = result.errorMsg;
            })
        });
    }

    changeShareType(type) {
        this.shareType = type;
    }
}
customElements.define('pagenote-modal', PageNoteModal);


class Loading extends LitElement{

    static get properties() {
        return {
            top: { type: Number},
        };
    }

    static get styles(){
        return css`
            @keyframes load{
              0%,100%{
                height: 40px;
                background: lightgreen;
              }
              50%{
                height: 70px;
                margin: -15px 0;
                background: lightblue;
              }
            }
            .loading{
              position: relative;
              /*top: 200px;*/
              width: 80px;
              height: 40px;
              margin: 0 auto;
            }
            .loading span{
              display: inline-block;
              width: 8px;
              height: 100%;
              border-radius: 4px;
              background: lightgreen;
              animation: load 1s ease infinite;
            }
            
            .loading span:nth-child(2){
              animation-delay:0.2s;
            }
            .loading span:nth-child(3){
              animation-delay:0.4s;
            }
            .loading span:nth-child(4){
              animation-delay:0.6s;
            }
            .loading span:nth-child(5){
              animation-delay:0.8s;
            }
        `
    }

    constructor() {
        super();
        this.top = 0;
    }

    render(){
        return html`
         <div class="loading" style='top:${this.top}px'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        `
    }
}

customElements.define('pagenote-loading', Loading);

