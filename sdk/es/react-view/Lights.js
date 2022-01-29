import { Fragment } from "react";
import React from "react";
import LightItem from "./LightItem";
export default function Lights(_a) {
    var lights = _a.lights, remove = _a.remove;
    return (React.createElement(Fragment, null, lights.map(function (item, index) { return (React.createElement("div", { key: item.id },
        React.createElement(LightItem, { light: item, remove: function () { remove(index); } }))); })));
}
//# sourceMappingURL=Lights.js.map