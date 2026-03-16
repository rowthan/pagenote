export * from './@types/index'

// 1. 先导入 extApi 中的所有命名导出（取一个别名）
import * as extApi from './extApi';

// 2. 转发命名导出（保留原有的命名导出能力）
export * from './extApi';

// 3. 新增默认导出（将命名导出聚合为默认导出）
export default extApi;
