export default AsideBar;
declare class AsideBar extends Component<any, any, any> {
    constructor(props: any);
    pagenote: any;
    toggleAllLight(): void;
    toggleAutoLight(): void;
    replay(...args: any[]): void;
    toggleSideBar(): void;
    refreshStatus(): void;
    changeLightStatus(index: any): void;
    setRef(dom: any): void;
    sideEl: any;
    confirmShare(): void;
    toggleHideSideBar(): void;
    setCategories: (categories: any) => void;
    bigPicture(e: any, snapshot: any, gallery?: any[], index?: number): void;
    removeSnapshot: (index: any) => void;
    capture: () => void;
    setLastFocus: (info: any) => void;
}
import { Component } from "react";
