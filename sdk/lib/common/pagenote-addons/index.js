import create_new_light from "./create_new_light";
import search from "./search";
import send_to_email from "./send_to_email";
import send_to_flomo from "./send_to_flomo";
import copy_to_clipboard from "./copy_to_clipboard";
export default {
    create_new_light: create_new_light,
    search: search,
    send_to_email: send_to_email,
    send_to_flomo: send_to_flomo,
    copy_to_clipboard: copy_to_clipboard,
};
var addons = [
    create_new_light, copy_to_clipboard, send_to_email, send_to_flomo, search,
];
export { addons };
//# sourceMappingURL=index.js.map