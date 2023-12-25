interface Data {
    [key: string]: any;
}

/**
 * 判断一个数值或字符串是否是一个合法的时间戳
 *
 * @param {number|string} value 要判断的值
 * @returns {boolean} 如果是合法的时间戳，则返回 true，否则返回 false
 */
function getValidDate(value: string|number) {
    // 检查长度
    if (value.toString().length !== 10 && value.toString().length !== 13) {
        return null;
    }

    // 检查范围
    if (Number(value) < 0) {
        return null;
    }

    // 检查格式
    // const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    // if (!regex.test(value.toString())) {
    //     return false;
    // }

    // 使用 Date.parse() 函数检查
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date : null
}

/**
 * 将一个 Date 对象转换为字符串，格式为 "2023-12-09 12:39:00"
 *
 * @param {Date} date 要转换的 Date 对象
 * @returns {string} 转换后的字符串
 */
function dateToStringWithSeconds24(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const markdownConvert = {
    // 将 JavaScript 对象转换为 Obsidian 文档字符串
    objectToMarkdown: (object: Data): string => {
        let obsidianString = "---\n";
        for (const [key, value] of Object.entries(object)) {
            if (Array.isArray(value)) {
                obsidianString += `${key}:\n`;
                for (const item of value) {
                    obsidianString += `- ${item}\n`;
                }
            } else if(getValidDate(value) || value instanceof Date){
                obsidianString += `${key}: ${dateToStringWithSeconds24(new Date(value))}\n`;
            }
            else {
                obsidianString += `${key}: ${value}\n`;
            }
        }
        obsidianString += "---\n\n";
        return obsidianString;
    },

    // 将 Obsidian 文档字符串转换为 JavaScript 对象
    markdownToObject: (obsidianString: string): Data => {
        const object: Data = {};
        const lines = obsidianString.split("\n");
        let currentKey = null;
        let currentValue: string[] = [];
        for (let i = 1; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line.startsWith("-")) {
                currentValue.push(line.substring(2).trim());
            } else {
                if (currentKey !== null) {
                    object[currentKey] = currentValue;
                }
                const [key, value] = line.split(":");
                currentKey = key;
                currentValue = [value];
            }
        }
        if (currentKey !== null) {
            object[currentKey] = currentValue;
        }
        return object;
    },
};

export default markdownConvert;
