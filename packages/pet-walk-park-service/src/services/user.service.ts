/**
 * 用户服务类
 */
import db from '../data-source'
import { User } from '../entities/user'

const userRepository = db.getRepository(User)

export class UserService {
  // 查询当前用户信息
  async userInfo() {
    return await userRepository.findAndCount()
  }
}
