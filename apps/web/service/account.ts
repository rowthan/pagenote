import { unionFetch } from '../utils/fetch'

/**请求登录*/
export function requestValidate(
  input: { uid?: number; email?: string; publicText?: string, validateType: string },
) {
    const {uid = 0, email = '', publicText = '', validateType} = input
    return unionFetch<{ requestValidate?: { publicText: string, validateEmail: string } }>(
        {
            url: '/api/graph/auth',
            method: 'POST',
            data: {
                mutation: `mutation{requestValidate(uid:${uid || 0},email:"${email.trim()}",publicText:"${publicText.trim()}",validateType:"${validateType}"){validateEmail,publicText,validateStatus}}`,
            },
        },
        {
            timeout: 10000,
        }
    )
}

export function confirmValidate(
  input: { publicText: string; validateText: string },
) {
  const { publicText = '', validateText = '' } = input
  return unionFetch<{ confirmValidate?: { validateStatus?: number } }>(
    {
      url: '/api/graph/auth',
      method: 'POST',
      data: {
        mutation: `mutation{confirmValidate(publicText:"${publicText.trim()}",validateText:"${validateText.trim()}"){validateStatus}}`,
      },
    },
      {
          timeout: 10000,
      }
  )
}

export function unBindAuth(input: {
    publicText: string,
    validateText: string,
    authType?: string,
    authId?: string,
}) {
    return unionFetch<{ unBindAuth?: { success?: boolean } }>(
        {
            url: '/api/graph/auth',
            method: 'POST',
            data: {
                mutation: `mutation make($authRequest: AuthRequest!) {unBindAuth(unbindRequest:$authRequest){success}}`,
                variables: {
                    authRequest: input
                },
            },
        },
    )
}

type AuthResponse = {
    pagenote_t: string
    profile: { nickname: string; email: string }
}

export function authCodeToToken(
    data: {
        code?: string,
        authType: string,
        redirectUri: string
    } | {
        authType: string,
        publicText?: string,
        validateText?: string,
        validateType: string
    },
) {
  return unionFetch<{ oauth?: AuthResponse }>(
      {
          url: '/api/graph/auth',
          method: 'POST',
          data: {
              mutation: `mutation make($authRequest: AuthRequest!) {oauth(bindRequest:$authRequest){pagenote_t,profile{nickname,email}}}`,
              variables: {
                  authRequest: data,
              }
          },
      },
  )
}
