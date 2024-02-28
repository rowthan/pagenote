import React, {Component, ComponentType, PropsWithChildren} from 'react';
import { getChildren, isUsedAsWebComponent, namedNodeMapToObject} from "../utils/webComponent";
import tailwindCss from './tailwind.css'
import { applyCss } from '../utils/css';


/**
 * PropsWithChildren<{container?: Document}>
 * 包装一个 react 组件,兼容 react 模式 & web compoennt 模式下的参数、样式处理
 * */ 
export function withComponentStyles (WrappedComponent: ComponentType<any>, css: string = ''){
    // 返回一个新的组件
    return class extends Component<PropsWithChildren<{container?: Document, _isWebComponent?: boolean}>> {
        componentDidMount() {
            const isWebComponent = isUsedAsWebComponent(this.props);
            // web component 模式下，需要将样式植入到宿主上
            if(isWebComponent){
                applyCss(tailwindCss, this.props.container)
                applyCss(css, this.props.container)
            }
        }
        render() {
            const isWebComponent = isUsedAsWebComponent(this.props);
            // @ts-ignore
            const props = isWebComponent ? namedNodeMapToObject((this.props.container?.host?.attributes || [])) : this.props;
            
            const children = getChildren(this.props);
            return (
                <WrappedComponent _isWebComponent={isWebComponent} {...this.props} {...props} >
                    {children}
                </WrappedComponent>
            );
        }
    } as typeof WrappedComponent;
}

/**
 * 包装组件，防止点击事件冒泡
 * 用途，例如 包裹 a 标签，阻止a 标签的默认跳转行为
 * */ 
export function withoutReAction(ReactComponent: ComponentType<{container?: Document}>){
    
    return class extends Component<PropsWithChildren<{container?: Document}>>{
        preventDefault(e: Event){
                e.stopPropagation();
                e.preventDefault();
        }

        componentDidMount(): void {
            // @ts-ignore
            const root = this.props.container?.host;
            if(root){
                root.addEventListener('click',this.preventDefault)
            }
        }

        componentWillUnmount(): void {
            // @ts-ignore
            const root = this.props.container?.host;
            if(root){
                root.removeEventListener('click',this.preventDefault)
            }
        }

        render(){
            return <ReactComponent {...this.props} />
        }
    }
}


