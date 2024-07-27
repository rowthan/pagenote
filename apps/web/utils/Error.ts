class PagenoteError extends Error {
    private readonly data: any;
    constructor(message:string, data:any) {
        super(message); // 调用父类的构造函数
        this.name = this.constructor.name; // 设置错误名称
        this.message = message; // 错误信息
        this.data = data;

        // 错误堆栈信息
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error()).stack;
        }

        // 执行自定义程序，例如上报服务器
        this.reportError();
    }

    // 自定义方法，用于上报错误
    reportError() {
        const { data, message } = this;
        console.log(`上报错误: ${message}, 数据: ${JSON.stringify(data)}`);

    }
}
