import fetchRequest from "../../src/actions/http";

describe('fetch get', () => {
    it('get html', async function () {
        const result = await fetchRequest({
            method: 'GET',
            url: 'https://baidu.com',
            body: null,
            headers:{

            }
        })
        expect(result).toHaveProperty('_response')
        expect(result).toHaveProperty('_headers')
        expect(result._headers).toHaveProperty('content-type')
        expect(result.status).toBe(200)
    });

    it('get javascript file', async function () {
        const result = await fetchRequest({
            method: 'GET',
            url: 'https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.9/dayjs.min.js',
            body: null,
            headers:{
                'Accept': 'text/html'
            }
        })
        expect(result.status).toBe(200)
        expect(result._headers['content-type']).toMatch('text/javascript')
    });

    it('get image', async function () {
        const result = await fetchRequest({
            method: 'GET',
            url: 'https://s.cn.bing.net/th?id=OHR.MacaroniPenguins_ZH-CN0600867997_1920x1080.webp&qlt=50',
            body: null,
            headers:{

            }
        })
        expect(result.status).toBe(200)
        expect(typeof result._response).toBe('object')
        expect(result?.headers?.get('content-type')).toBe('image/webp')
        expect(result._response).toBeInstanceOf(Blob)
    });



    it('get json', async function () {
        const result = await fetchRequest({
            method: 'GET',
            url: 'https://tieba.baidu.com/show/getlivestat',
            body: null,
            headers:{
                'Accept':'text/html',
            }
        })
        expect(result.status).toBe(200)
        expect(result._headers['content-type']).toMatch('application/json')
        expect(result._response).toEqual({"no":210009,"error":"未知错误","data":[]})
    });


})
