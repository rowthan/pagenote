var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Steps = /** @class */ (function (_super) {
    __extends(Steps, _super);
    function Steps(option) {
        var _this = _super.call(this) || this;
        _this.option = option;
        _this.lastFocus = '';
        return _this;
    }
    Steps.prototype.removeStep = function (lightId) {
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            if (lightId === item.data.lightId) {
                this.splice(i, 1);
                break;
            }
        }
        this.option.saveDatas();
    };
    Steps.prototype.save = function () {
        this.option.saveDatas();
    };
    Steps.prototype.add = function (item) {
        item.options.save = this.option.saveDatas;
        item.init();
        this.push(item);
    };
    ;
    return Steps;
}(Array));
// function Steps(option: any) {
//     this.option = option;
//     this.lastFocus = null;
// }
// Steps.prototype = Array.prototype;
//
// Steps.prototype.removeStep = function (lightId:string) {
//     for(let i=0; i<this.length; i++){
//         const item = this[i];
//         if(lightId===item.data.lightId){
//             this.splice(i,1);
//             break;
//         }
//     }
//     this.option.saveDatas();
// }
// Steps.prototype.save = function () {
//     this.option.saveDatas();
// }
// Steps.prototype.add = function (item) {
//     item.__proto__.steps = this;
//     if(item.delete){
//         item.init();
//         this.push(item);
//     }else{
//         console.error('非法类型',item,item.prototype,item.__proto__,Step.constructor);
//     }
// };
export default Steps;
//# sourceMappingURL=pagenote-steps.js.map