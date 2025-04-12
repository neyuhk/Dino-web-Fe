import http from './http/http.ts'

export const saveCodeBlock = async (payload: any) => {
    return await http.post('/code-block', payload);
}

export const getLastestCodeBlock = async () => {
    return await http.get(`/code-block/latest`);
}

export const pushCodeToDb = async (code: string) => {
    const payload = {
        code: code
    };
    return await http.post('/code-block/push', payload);
}
