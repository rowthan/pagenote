import { AxiosRequestConfig } from 'axios';
declare const actions: {
    [x: string]: ((inputString: string, filename: string) => void) | ((config: AxiosRequestConfig) => import("axios").AxiosPromise<any>);
};
export default actions;
