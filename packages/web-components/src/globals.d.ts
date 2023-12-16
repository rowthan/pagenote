declare module '*.scss'
declare module '*.css'
declare module '*.css?inline'
declare module '*.html'

declare module '*.scss?inline' {
  const content: string;
  export default content;
}
