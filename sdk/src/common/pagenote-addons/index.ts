import create_new_light from "./create_new_light";
import search from "./search";
import send_to_email from "./send_to_email";
import send_to_flomo from "./send_to_flomo";
import copy from "./copy";

export default {
    [create_new_light.id]: create_new_light,
    [search.id]: search,
    [send_to_email.id]: send_to_email,
    [send_to_flomo.id]: send_to_flomo,
    [copy.id]: copy,
}

const addons = [
    create_new_light,copy,send_to_email,send_to_flomo,search,
]

const sceneMap = {
    text: '选中文本时'
}

export {
    addons,
    sceneMap,
}