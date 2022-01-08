export default createModal;
declare function createModal(element: any, position: any): void;
declare class createModal {
    constructor(element: any, position: any);
    root: HTMLElement;
    content: HTMLElement;
    show(element: any, position: any): void;
    _onresize: () => void;
    destroy(): void;
}
