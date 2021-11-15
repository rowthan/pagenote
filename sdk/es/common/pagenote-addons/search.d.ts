declare const search: {
    icon: string;
    id: string;
    name: string;
    settings: ({
        gridSize: number;
        name: string;
        label: string;
        type: string;
        data: {
            value: string;
            label: string;
        }[];
        rules?: undefined;
    } | {
        gridSize: number;
        name: string;
        label: string;
        type: string;
        data: {
            value: string;
            label: string;
        }[];
        rules: {
            required: boolean;
            message: string;
        }[];
    } | {
        gridSize: number;
        name: string;
        label: string;
        type: string;
        rules: {
            pattern: RegExp;
            message: string;
        }[];
        data?: undefined;
    })[];
    description: string;
    scene: string;
    clickScript: string;
    defaultSetting: {
        engine: string;
        new_tab: string;
    };
};
export default search;
