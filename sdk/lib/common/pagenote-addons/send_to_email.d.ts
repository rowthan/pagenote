declare const send_to_email: {
    icon: string;
    id: string;
    name: string;
    clickScript: string;
    scene: string;
    settings: {
        gridSize: number;
        name: string;
        label: string;
        type: string;
    }[];
    defaultSetting: {
        email: string;
    };
    description: string;
};
export default send_to_email;
