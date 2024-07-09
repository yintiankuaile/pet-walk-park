/**
 * 用户服务类
 */
import db from '../../data-source';
import { User } from '../entities/user.entity';

const userRepository = db.getRepository(User)

export class UserService {
  // 查询当前用户信息
  async userInfo() {
    try {
        const parks = await userRepository.findAndCount();
        return parks;
    } catch (error) {
        console.error('Error fetching parks:', error);
        throw new Error('Internal Server Error');
    }
}
}
