/**
 * 用户 controller
 */
import { Controller, Get } from 'routing-controllers'
import { UserService } from '../services/user.service'

@Controller('/user')
export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Get('/userInfo')
  async userInfo() {
    try {
        return await this.userService.userInfo();
    } catch (error) {
        console.error('Error in UserController:', error);
        throw new Error('Internal Server Error');
    }
}
}
