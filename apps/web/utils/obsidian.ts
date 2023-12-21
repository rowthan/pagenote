import Obsidian from "@pagenote/obsidian";

const obsidian = new Obsidian({
    token: process.env.OBSIDIAN_TOKEN || '',
    host: 'http://127.0.0.1:27123',
});

export default obsidian;