declare const _default: {
    create_new_light: {
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
    search: {
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
    send_to_email: {
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
    send_to_flomo: {
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
    copy_to_clipboard: {
        icon: string;
        id: string;
        name: string;
        description: string;
        scene: string;
        settings: never[];
        clickScript: string;
    };
};
export default _default;
declare const addons: ({
    icon: string;
    id: string;
    name: string;
    description: string;
    scene: string;
    settings: never[];
    clickScript: string;
} | {
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
} | {
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
} | {
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
} | {
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
})[];
declare const sceneMap: {
    text: string;
};
export { addons, sceneMap, };
