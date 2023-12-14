
export const makeExportString = (pages=[],version)=>{
    const exportDataObject = {
        pages: pages,
        version: 1,
        extension_version: version,
        export_time: new Date().getTime(),
    }
    const dataString = encodeURIComponent(JSON.stringify(exportDataObject));

    return dataString;
}

export const revertImportString = function (string) {
    
}

