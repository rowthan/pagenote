
export enum AuthType {
  GITHUB = 'github',
  NOTION = 'notion',
  WEBDAV = 'webdav',
  EMAIL = 'email',
}


export const AuthConfig: Record<
  AuthType,
  {
    label: string
    icon: string
    platformUrl: string
    redirectUri: () => string
    getAuthLInk: () => string
  }
> = {
  notion: {
    label: 'Notion授权',
    getAuthLInk: function () {
      return `https://api.notion.com/v1/oauth/authorize?client_id=3f5182ae-a3a4-46b1-8e17-b1e9f2c7e37a&response_type=code&owner=user&redirect_uri=${this.redirectUri()}`
    },
    icon: 'https://pagenote-public.oss-cn-beijing.aliyuncs.com/_static/notion.ico',
    platformUrl: 'https://www.notion.so/my-integrations',
    redirectUri: function () {
      return window.location.origin + '/oauth/callback_notion'
    },
  },
  webdav: {
    label: 'webdav授权',
    icon: '',
    platformUrl: '',
    redirectUri: function () {
      return ''
    },
    getAuthLInk: function () {
      return `/oauth/webdav`
    },
  },
  github: {
    label: 'GitHub授权',
    getAuthLInk: function () {
      return `https://github.com/login/oauth/authorize?scope=user%20repo&client_id=Iv1.fbdc49e54f75d9af&allow_signup=true&redirect_uri=${this.redirectUri()}`
    },
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    platformUrl: 'https://github.com/settings/installations',
    redirectUri: function () {
      return window.location.origin + '/oauth/callback_github'
    },
  },
  email: {
    label: '邮箱验证',
    icon: '/img/email.webp',
    platformUrl: '',
    redirectUri: function () {
      return ''
    },
    getAuthLInk: function () {
      return `/oauth/email`
    },
  },
}
