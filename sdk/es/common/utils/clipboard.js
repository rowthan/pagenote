function writeTextToClipboard(text) {
    if (text === void 0) { text = ''; }
    try {
        return navigator.clipboard.writeText(text).then(function () {
            return true;
        });
    }
    catch (e) {
        var textarea = document.createElement('textarea');
        textarea.textContent = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('Copy', false, null);
        document.body.removeChild(textarea);
        return Promise.resolve(true);
    }
}
export { writeTextToClipboard, };
//# sourceMappingURL=clipboard.js.map