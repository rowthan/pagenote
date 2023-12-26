interface Data {
    [key: string]: any;
}

function isTimeStamp(value: number) {
    return value > 1000000000000 && value < 9000000000000
}

/**
 * 判断一个数值或字符串是否是一个合法的时间戳
 *
 * @param {number|string} value 要判断的值
 * @returns {boolean} 如果是合法的时间戳，则返回 true，否则返回 false
 */
function getValidDate(value: string|number | Date) {
    if(value instanceof Date){
        return value
    }
    if(typeof value === 'number'){
        const unValid = !isTimeStamp(value)
        if(unValid){
            return null;
        }
    }
    if(typeof value==='string'){
        const unValid = !/^\d{4}\-\d{2}\-\d{2}/.test(value)
        if(unValid){
            return null;
        }
    }

    try{
        const date = new Date(value);
        return !isNaN(date.getTime()) ? date : null
    }catch (e) {
        return null;
    }
}

function getValueByString(input: string) {
    if(input && input.length !== input.trimEnd().length){
        return input ? input.trim() : '';
    }

    if(['false','true'].includes(input)){
        return input === 'true'
    }

    const date = getValidDate(input)
    if(date){
        return date;
    }

    if(!isNaN(Number(input))){
        return Number(input)
    }


    return input ? input.trim() : '';
}

function getStringByValue(value: any) {
    if(typeof value === 'number'){
        return value
    }  if(value instanceof Date){
        return `${dateToStringWithSeconds24(value)}`;
    } else if(typeof value === 'boolean'){
        return `${value}`;
    } else if(typeof value === 'string' && !Number.isNaN(Number(value))){
        // 为了区分字符串和数值，在尾部或头部增加一个空格
        return `${value} `;
    } else if(getValidDate(value)){
        return `${value} `
    }

    return `${value}`
}
/**
 * 将一个 Date 对象转换为字符串，格式为 "2023-12-09 12:39:00"
 *
 * @returns {string} 转换后的字符串
 * @param date
 */
function dateToStringWithSeconds24(date: Date) {
    // const date = new Date(userDate.getTime() + userDate.getTimezoneOffset() * 60 * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export const markdownConvert = {
    /**
     * 将 JavaScript 对象转换为 Obsidian 文档字符串
     *
     * */
    objectToMarkdown: (object: Data): string => {
        let obsidianString = "---\n";
        for (const [key, value] of Object.entries(object)) {
            if (Array.isArray(value)) {
                obsidianString += `${key}:\n`;
                for (const item of value) {
                    obsidianString += `- ${getStringByValue(item)}\n`;
                }
            } else {
                obsidianString += `${key}: ${getStringByValue(value)}\n`;
            }
        }
        obsidianString += "---\n";
        return obsidianString;
    },

    // 将 Obsidian 文档字符串转换为 JavaScript 对象
    markdownToObject: (obsidianString: string): Data => {
        const lines = obsidianString.split("\n");
        const object: Record<string, any> = {};
        // 数值收集器
        let currentValue:any[] = [];
        let currentKey:string = "";

        let isArray = false;
        for (let i = 1; i < lines.length - 1; i++) {
            const line = lines[i];
            if(line.startsWith("---")){
                continue
            }
            const keyValue = line.split(":");
            // 解析 key : value
            if (line.startsWith("-")) {
                isArray = true;
                currentValue.push(line.substring(2).trimStart());
            } else if(keyValue.length >= 2){
                currentKey = keyValue[0].trim();
                const lineValue = keyValue.slice(1, keyValue.length).join(":").trimStart();
                currentValue = lineValue ? [lineValue] : [];
                isArray = false
            } else {
                currentValue.push(line)
                isArray = false;
            }


            let finalValue;
            if(isArray){
                finalValue = currentValue.map(item => getValueByString(item));
            }else{
                finalValue = getValueByString(currentValue[0]);
            }
            if(currentKey !==''){
                object[currentKey] = finalValue
            }
        }

        return object;
    },
};

