/**
 * 公园服务类
 */
import db from '../../data-source';
import { Park } from '../entities/park.entity';

const parkRepository = db.getRepository(Park);

export class ParkService {
    // 查询全部公园
    async queryList() {
        return await parkRepository.findAndCount()
    }
}