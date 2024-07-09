/**
 * 用户 controller
 */
import { Controller, Get } from 'routing-controllers'
import { UserService } from '../services/user.service'

@Controller('/user')
export class UserController {
  userService
  constructor() {
    this.userService = new UserService();
  }

  @Get('/userInfo')
  userInfo() {
    return this.userService.userInfo();
  }
}
