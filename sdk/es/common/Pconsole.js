var Pconsole = function (option) {
    this.option = option;
};
Pconsole.prototype.log = function () {
    if (this.option.showLog) {
        // @ts-ignore
        console.log.apply(console, arguments);
    }
};
Pconsole.prototype.debug = function () {
    if (this.option.showLog) {
        // @ts-ignore
        console.log.apply(console, arguments);
    }
};
Pconsole.prototype.error = function () {
    if (this.option.showLog) {
        // @ts-ignore
        console.error.apply(console, arguments);
    }
};
export default Pconsole;
//# sourceMappingURL=Pconsole.js.map