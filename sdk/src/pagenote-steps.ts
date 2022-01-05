// TODO step 继承 Steps
import Step from "./pagenote-step";

interface StepOption {
    saveDatas: Function
}

class Steps extends Array{
    option: StepOption
    lastFocus: string

    constructor(option:StepOption) {
        super();
        this.option = option
        this.lastFocus = ''
    }

    removeStep(lightId:string){
        for(let i=0; i<this.length; i++){
            const item = this[i];
            if(lightId===item.data.lightId){
                this.splice(i,1);
                break;
            }
        }
        this.option.saveDatas();
    }

    save() {
        this.option.saveDatas();
    }

    add(item:Step) {
        item.options.save = this.option.saveDatas
        item.init();
        this.push(item);
    };
}

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

export default Steps
