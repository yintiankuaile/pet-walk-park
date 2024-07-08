/**
 * 用户实体
 */
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user') // 将 User 类标记为一个实体，并将其映射到数据库中的一个表
export class User {
  @PrimaryGeneratedColumn() // 将 id 属性标记为主键列，并自动生成值
  id!: number

  @Column() // 将 openid 属性映射到数据库中的一个列
  openid!: string 

  @Column() // 将 nickname 属性映射到数据库中的一个列
  nickname!: string

  @Column()
  avatarUrl!: string

  @Column()
  gender!: string

  @Column()
  city!: string

  @Column()
  country!: string

  @Column()
  province!: string

  @Column({ type: 'date', name: 'created_at' })
  createdAt!: string

  @Column({ type: 'date', name: 'updated_at' })
  updatedAt!: string
}
