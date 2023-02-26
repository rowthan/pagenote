import {getDefaultBrush, LightStatus, LightType} from "../pagenote-brush";
import {setting} from "../extApi";
import SDK_SETTING = setting.SDK_SETTING;
import SDK_VERSION = setting.SDK_VERSION;

export function getDefaultSdkSetting(originSetting: Partial<SDK_SETTING> = {}): SDK_SETTING {
    const defaultBrushes = [
        getDefaultBrush({
            bg: '#ffe534',
        }),
        getDefaultBrush({
            bg: '#A6FFE9',
            label: '删除线',
            lightType: LightType.deleteLine,
            defaultStatus: LightStatus.un_light
        }),
        getDefaultBrush({
            bg: '#FFC7BA',
            defaultStatus: LightStatus.full_light
        }),
        getDefaultBrush({
            bg: '#B8EEFF',
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#FFD0EF',
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#D9C3FF',
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#a64db4',
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#195772',
            defaultStatus: LightStatus.half_light
        }),
        getDefaultBrush({
            bg: '#4467a8',
            defaultStatus: LightStatus.half_light
        }),
    ]
    const setting: SDK_SETTING = {
        // _libra: false,
        // _sync: false,
        actions: [],
        brushes: defaultBrushes,
        controlC: true,
        controlCTimeout: 0,
        disableList: [],
        convertMethods: [],
        lastModified: 0,
        dataVersion: SDK_VERSION.ts_format,

        keyupTimeout: 0,
        maxRecord: 999,
        showBarTimeout: 0,

        _sdkVersion: "5.5.3"
    }
    return {
        ...setting,
        ...originSetting
    }
}
