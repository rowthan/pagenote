
function writeTextToClipboard(text=''):Promise<boolean> {
    try {
        return navigator.clipboard.writeText(text).then(function () {
            return true
        })
    } catch (e) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('Copy', false, null);
        document.body.removeChild(textarea)
        return Promise.resolve(true);
    }
}



export {
    writeTextToClipboard,
}
