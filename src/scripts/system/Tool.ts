type FilesData = {
    key: string;
    data: any;
}

interface WebpackRequireContext {
    keys(): string[];
    <T>(id: string): T;
}

export class Tools {
    /**
     * massiveRequire 接受 require.context 返回的上下文对象
     * req.keys 获取上下文中所有匹配模式的文件路径
     * 遍历这些文件路径，将每个文件的路径和内容存储在一个对象
     * **/
    static massiveRequire(req: WebpackRequireContext) {
        const files: FilesData[] = [];
        req.keys().forEach(key => {
            files.push({
                key, data: req(key)
            });
        });
        return files;
    }

    static randomNumber(min: number, max: number) {
        if (!max) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}