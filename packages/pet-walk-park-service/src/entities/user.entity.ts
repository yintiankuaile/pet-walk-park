/**
 * 用户实体
 */
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Users') // 将 User 类标记为一个实体，并将其映射到数据库中的一个表，此处名字要跟数据库的关联的表名一致
export class User {
  @PrimaryGeneratedColumn() // 将 id 属性标记为主键列，并自动生成值
  id!: number

  @Column() // 将 openid 属性映射到数据库中的一个列
  openid!: string 

  @Column() // 将 nickname 属性映射到数据库中的一个列
  nickname!: string

  @Column({ type: 'varchar', name: 'avatar_url'})
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
