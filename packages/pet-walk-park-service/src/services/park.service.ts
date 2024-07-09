/**
 * 公园服务类
 */
import db from '../../data-source';
import { Park } from '../entities/park.entity';

const parkRepository = db.getRepository(Park);

export class ParkService {
    // 查询全部公园
    async queryList() {
        try {
            const parks = await parkRepository.findAndCount();
            return parks;
        } catch (error) {
            console.error('Error fetching parks:', error);
            throw new Error('Internal Server Error');
        }
    }
}