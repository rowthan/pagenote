import  Obsidian from "@pagenote/obsidian";


const obsidian = new Obsidian({
    token: process.env.OBSIDIAN_TOKEN || '',
});

export default obsidian;
