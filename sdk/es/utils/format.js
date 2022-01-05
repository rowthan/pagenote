import { BAR_STATUS } from "../const";
var getDefaultOption = function () {
    return {
        dura: 100,
        enableMarkImg: false,
        blacklist: [],
        autoLight: false,
        brushes: [
            {
                bg: 'rgba(114,208,255)',
                shortcut: 'p',
                label: '',
                level: 1,
            }, {
                bg: '#ffbea9',
                shortcut: 'n',
                label: '',
                level: 1,
            }
        ],
        barInfo: {
            right: 2,
            top: 100,
            status: BAR_STATUS.fold,
        },
        actionBarOffset: {
            offsetX: 10,
            offsetY: 20,
        },
        showIconAnimation: true,
        onShare: null,
        functionColors: [],
        sideBarActions: [],
        categories: [],
        showBarTimeout: 20,
        keyupTimeout: 500,
        debug: false,
        autoTag: true,
        renderAnnotation: function () {
        },
        // check 函数
        beforeRecord: function () {
            return true;
        }
    };
};
export { getDefaultOption };
//# sourceMappingURL=format.js.map