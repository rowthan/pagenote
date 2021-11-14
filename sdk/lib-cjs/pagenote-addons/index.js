"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addons = void 0;
var create_new_light_1 = require("./create_new_light");
var search_1 = require("./search");
var send_to_email_1 = require("./send_to_email");
var send_to_flomo_1 = require("./send_to_flomo");
var copy_to_clipboard_1 = require("./copy_to_clipboard");
exports.default = {
    create_new_light: create_new_light_1.default,
    search: search_1.default,
    send_to_email: send_to_email_1.default,
    send_to_flomo: send_to_flomo_1.default,
    copy_to_clipboard: copy_to_clipboard_1.default,
};
var addons = [
    create_new_light_1.default, copy_to_clipboard_1.default, send_to_email_1.default, send_to_flomo_1.default, search_1.default,
];
exports.addons = addons;
//# sourceMappingURL=index.js.map