interface Message {
    message: string;
    type: string;
    duration: number;
    position?: {
        x: string;
        y: string;
    };
    color?: string;
    e?: any;
}
export default function notification(showMessage: Message): void;
export {};
