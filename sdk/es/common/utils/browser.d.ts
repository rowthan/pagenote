declare enum BrowserType {
    Edge = "edge",
    IE = "ie",
    SAFARI = "safari",
    Firefox = "firefox",
    OPREAR = "opera",
    CHROME = "chrome",
    UNKNOW = ""
}
declare function getBrowserTypeAndVersion(): {
    type: BrowserType;
    version: string;
    iOS: boolean;
};
export { getBrowserTypeAndVersion };
