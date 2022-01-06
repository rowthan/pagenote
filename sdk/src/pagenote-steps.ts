// TODO step 继承 Steps
import IStep from "./pagenote-step";

interface StepOption {
    saveDatas: Function
}

class Steps extends Array<IStep>{
    option: StepOption

    constructor(option:StepOption) {
        super();
        this.option = option
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

    add(item:IStep) {
        item.init();
        item.options.save = this.save;
        item.options.remove = this.removeStep;
        item.options.getIndex = function (lightId:string) {
            let index = -1;
            for(let i=0; i<this.length; i++){
                if(this[i].data.lightId===lightId){
                    index = i;
                    break;
                }
            }
            return index;
        }
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
//         console.error('非法类型',item,item.prototype,item.__proto__,IStep.constructor);
//     }
// };

export default Steps
