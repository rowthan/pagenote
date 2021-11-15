interface Message {
    message: string;
    type?: string;
    duration?: number;
    placement?: string;
    position?: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    };
    color?: string;
}
declare function notification(showMessage: Message): void;
export default notification;
