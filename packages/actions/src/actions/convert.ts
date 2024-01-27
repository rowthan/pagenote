import {IAction} from "../typing/IAction";
import Handlebars from 'handlebars';

Handlebars.registerHelper('lookup', function (obj, key) {
    return obj[key];
});

const convert: IAction = {
    description: "",
    id: "pagenote/convert",
    version: "1",
    run(args: { template: string, variables: any }): Promise<string> {
        const template = Handlebars.compile(args.template,{});
        const replacedString = template(args.variables);
        return Promise.resolve(replacedString);
    },
}

export default convert;
