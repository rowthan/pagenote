export function dataToString(data: any, exportTemplate?: {
    template: string;
    fileExt: string;
    icon: string;
    name: string;
    description: string;
}): {
    success: boolean;
    data: any;
};
