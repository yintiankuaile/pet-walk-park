import path from 'path'
import { DataSource } from 'typeorm'

const dataSource = new DataSource({
  type: 'mysql', // 数据库类型
  host: '116.198.247.204', // 云服务器的 IP 地址
  port: 3306, // MySQL 服务启动端口
  username: 'root', // MySQL 用户名
  password: 'Z931125&l', // MySQL 密码
  database: 'programdb', // 数据库名称
  entities: [path.join(__dirname, '/../**/*.entity.{js,ts}')], // typeorm 实体
  entityPrefix: 'zm-', // 数据库表前缀
  logging: true // 开启日志
})

export default dataSource;