export const basePath = process.env.prefix || ''
export const isExt = basePath == '/web'
export const isDev = process.env.NODE_ENV === 'development'
