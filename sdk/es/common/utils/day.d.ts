declare const countdownTime: (date1: number) => [number, number, number, number];
declare const computeLeftTime: (expiredAt: number, lastModAt: number) => {
    percent: number;
    label: string;
};
export { countdownTime, computeLeftTime, };
