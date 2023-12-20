import React, {Component, ComponentType, PropsWithChildren} from 'react';
import {applyCss, namedNodeMapToObject} from "pagenote/utils/webComponent";
import tailwindCss from '!!raw-loader!sass-loader!postcss-loader!./tailwind.css'

// PropsWithChildren<{container?: Document}>
function withComponentStyles (WrappedComponent: ComponentType<any>, css?: string){
    // 返回一个新的组件
    return class extends Component<PropsWithChildren<{container?: Document}>> {
        componentDidMount() {
            applyCss(tailwindCss, this.props.container)
            if(css){
                applyCss(css, this.props.container)
            }
        }
        render() {
            const isWebComponent = this.props.container && this.props.container.nodeName === '#document-fragment';
            // @ts-ignore
            const props = isWebComponent ? namedNodeMapToObject((this.props.container?.host?.attributes || [])) : this.props;
            return <WrappedComponent {...this.props} {...props} >
                {isWebComponent ? <slot></slot> : this.props.children}
            </WrappedComponent>;
        }
    } as typeof WrappedComponent;
}


// const withCustomStyles = (
//     WrappedComponent: ComponentType<any>
// ) => {
//     // 返回一个新的函数式组件
//     const WithStyles: typeof WrappedComponent = (props) => {
//         const isWebComponent = props.container && props.container.nodeName === '#document-fragment';
//         const cssResolveFlag = useRef(false)
//         function resolveCss() {
//             if(cssResolveFlag.current){
//                 console.warn('样式已生效')
//                 return;
//             }
//             applyCss(tailCss, props.container)
//             cssResolveFlag.current = true;
//         }
//
//         useEffect(function () {
//             resolveCss()
//         },[])
//
//
//         // 渲染被包装的组件，并传递所有 props
//         return <WrappedComponent {...props} >
//             {isWebComponent ? <slot></slot> : props.children}
//         </WrappedComponent>;
//     };
//
//     return WithStyles;
// };

export default withComponentStyles;

