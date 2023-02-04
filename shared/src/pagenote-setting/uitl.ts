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
        enableType: 'always',
        // _libra: false,
        // _sync: false,
        actions: [],
        autoBackup: 3600 * 24 * 7,
        brushes: defaultBrushes,
        commonSetting: {
            keyupTimeout: 0,
            maxRecord: 999,
            removeAfterDays: 30,
            showBarTimeout: 0
        },
        controlC: true,
        controlCTimeout: 0,
        copyAllowList: [],
        disableList: [],
        enableMarkImg: false,
        convertMethods: [],
        lastModified: 0,
        updateAt: 0,
        dataVersion: SDK_VERSION.ts_format,
        useRecommend: true,

        keyupTimeout: 0,
        maxRecord: 999,
        removeAfterDays: 30,
        showBarTimeout: 0,

        _sdkVersion: "5.5.3"
    }
    return {
        ...setting,
        ...originSetting
    }
}
