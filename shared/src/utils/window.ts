function openWindow(url:string,target:string,size:{width:number,height:number}) {
    const w = size.width || 550;
    const h = size.height || 600;
    let left = screen.width / 2 - w / 2;
    let top = screen.height / 2 - h / 2;

    window.open(url, target,'toolbar=yes, directories=no, status=yes, menubar=no, scrollbars=no, resizable=no, copyhistory=no, ' +
        'width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left,)
}

export {
    openWindow
}