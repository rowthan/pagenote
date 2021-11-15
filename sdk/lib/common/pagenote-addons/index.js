var _a;
import create_new_light from "./create_new_light";
import search from "./search";
import send_to_email from "./send_to_email";
import send_to_flomo from "./send_to_flomo";
import copy from "./copy";
export default (_a = {},
    _a[create_new_light.id] = create_new_light,
    _a[search.id] = search,
    _a[send_to_email.id] = send_to_email,
    _a[send_to_flomo.id] = send_to_flomo,
    _a[copy.id] = copy,
    _a);
var addons = [
    create_new_light, copy, send_to_email, send_to_flomo, search,
];
var sceneMap = {
    text: '选中文本时'
};
export { addons, sceneMap, };
//# sourceMappingURL=index.js.map