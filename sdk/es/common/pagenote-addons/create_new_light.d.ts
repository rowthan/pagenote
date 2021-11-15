declare const create_new_light: {
    id: string;
    icon: string;
    name: string;
    shortcut: string;
    clickScript: string;
    scene: string;
    description: string;
    settings: {
        gridSize: number;
        name: string;
        label: string;
        type: string;
    }[];
    defaultSetting: {
        bg: string;
    };
};
export default create_new_light;
