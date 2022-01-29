interface EmitFun {
    (data: any): void;
}
declare const $on: (name: string, fn: EmitFun) => void;
declare const $emit: (name: string, val: any) => void;
declare const $off: (name: string, fn: EmitFun) => void;
export { $on, $emit, $off };
