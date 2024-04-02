
export function genMemoData(id?: string) {
    return {
        id: id || 'init_key'+Date.now(),
        url: 'http://localhost:8080',
        markdown: `这是我的笔记，可以修改`,
        createAt: Date.now(),
        updateAt: Date.now(),
    }
}
