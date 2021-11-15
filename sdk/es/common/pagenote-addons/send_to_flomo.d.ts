declare const send_to_flomo: {
    id: string;
    version: string;
    icon: string;
    name: string;
    clickScript: string;
    settings: {
        gridSize: number;
        name: string;
        label: string;
        type: string;
        rules: ({
            required: boolean;
            message: string;
            pattern?: undefined;
        } | {
            pattern: RegExp;
            message: string;
            required?: undefined;
        })[];
    }[];
    scene: string;
    description: string;
    defaultSetting: {
        apiLink: string;
    };
};
export default send_to_flomo;
