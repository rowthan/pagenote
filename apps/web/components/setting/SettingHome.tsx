import BasicSettingLine, {SettingSection} from './BasicSettingLine'
import useWhoAmi from '../../hooks/useWhoAmi'
import {BrowserType} from '@pagenote/shared/lib/utils/browser'
import DeviceInfo from "../account/DeviceInfo";

export default function SettingHome() {
    const [whoAmI] = useWhoAmi()
    const isFirefox = whoAmI?.browserType === BrowserType.Firefox

    function gotoSetting() {
        const url = whoAmI?.origin + '/web/ext/setting.html#/setting/light'
        window.open(url, 'setting')
        window.close()
    }

    return (
        <>
            <SettingSection>
                <BasicSettingLine label={'存储空间'} path={'/setting/data'}/>

                <BasicSettingLine
                    label={'画笔设置'}
                    path={isFirefox ? '' : '/setting/light'}
                    onClick={isFirefox ? gotoSetting : undefined}
                />

                <BasicSettingLine label={'快捷键'} path={'/setting/shortcut'}/>

            </SettingSection>

            <SettingSection className={'my-4'}>
                <BasicSettingLine label={'隐私与安全'} path={'/setting/safety'}/>
            </SettingSection>


            <SettingSection className={'mt-6'}>
                <BasicSettingLine
                    label={'插件版本'}
                    subLabel={<a className={'hover:underline'} href={whoAmI?.extensionStoreUrl}
                                 target={'_blank'}>{whoAmI?.extensionPlatform}</a>}
                    right={
                        <DeviceInfo/>
                    }
                />
            </SettingSection>
        </>
    )
}
