import {getDefaultBrush, LightStatus, LightType} from "../pagenote-brush";
import {setting} from "../extApi";
import SDK_SETTING = setting.SDK_SETTING;
import SDK_VERSION = setting.SDK_VERSION;

export function getDefaultSdkSetting(originSetting: Partial<SDK_SETTING> = {}): SDK_SETTING {
    const defaultBrushes = [
        getDefaultBrush({
            bg: '#ffe534',
            shortcut:"1",
        }),
        getDefaultBrush({
            bg: '#A6FFE9',
            label: '删除线',
            lightType: LightType.deleteLine,
            defaultStatus: LightStatus.un_light,
            shortcut:"2",
        }),
        getDefaultBrush({
            bg: '#FFC7BA',
            shortcut:"3",
            defaultStatus: LightStatus.full_light
        }),
        getDefaultBrush({
            bg: '#B8EEFF',
            shortcut:"4",
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#FFD0EF',
            shortcut:"5",
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#D9C3FF',
            shortcut:"6",
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#a64db4',
            shortcut:"7",
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#195772',
            shortcut:"8",
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#4467a8',
            shortcut:"9",
            defaultStatus: LightStatus.half_light
        }),
    ]
    const setting: SDK_SETTING = {
        // _libra: false,
        // _sync: false,
        actions: [],
        brushes: defaultBrushes,
        controlC: true,
        disableList: [],
        convertMethods: [],
        // lastModified: 0,
        // dataVersion: SDK_VERSION.ts_format,

        keyupTimeout: 0,
        showBarTimeout: 0,
    }
    return {
        ...setting,
        ...originSetting
    }
}
