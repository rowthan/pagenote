import md5 from "md5";
import {Step, WebPage} from "@pagenote/shared/lib/@types/data";

export function LightFormatFromWebPage(step: Step, webPage: Partial<WebPage>) {
    // @ts-ignore
    step.createAt = step.createAt || webPage.createAt || webPage?.plainData?.createAt;
    step.pageKey = step.pageKey || webPage.key || webPage.url;
    // @ts-ignore
    step.updateAt = step.updateAt || webPage.updateAt || webPage?.plainData?.updateAt;
    step.url = step.url || webPage.url || webPage.key;
    step.lightId = step.lightId || step.key || md5(JSON.stringify(step));
    step.key = step.key || step.lightId || md5(JSON.stringify(step));
    return step;
}
