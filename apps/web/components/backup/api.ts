/**导入*/
import {SnapshotResource, Step, WebPage} from "@pagenote/shared/lib/@types/data";
import extApi from "@pagenote/shared/lib/pagenote-api";

export async function importPages(pages: Partial<WebPage>[]) {
    for(let i=0; i<pages.length; i++){
        const page = pages[i] as WebPage;
        await extApi.lightpage.addPages([page])
    }
}

export async function importLights(lights: Partial<Step>[], webpage?: WebPage) {
    for(let i=0; i<lights.length; i++){
        lights[i].pageKey = lights[i].pageKey || webpage?.key;
        lights[i].url = lights[i].url || webpage?.url;
        await extApi.lightpage.addLights([lights[i] as Step],{
            timeout: 2000
        })
    }
}

export async function importSnapshots(snapshots: Partial<SnapshotResource>[]) {
    return extApi.lightpage.addSnapshots(snapshots as SnapshotResource[])
}
