// @ts-nocheck
interface PconsoleOption {
    showLog: true,
}

const Pconsole = function (option:PconsoleOption) {
    this.option = option;
}

Pconsole.prototype.log = function () {
    if(this.option.showLog){
        // @ts-ignore
        console.log(...arguments)
    }
}

Pconsole.prototype.debug = function () {
    if(this.option.showLog){
        // @ts-ignore
        console.log(...arguments)
    }
}

Pconsole.prototype.error = function () {
    if(this.option.showLog){
        // @ts-ignore
        console.error(...arguments)
    }
}

export default Pconsole