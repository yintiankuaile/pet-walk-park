/**
 * 公园实体
 */
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Parks') // 将 Park 类标记为一个实体，并将其映射到数据库中的一个表，此处名字要跟数据库的关联的表名一致
export class Park {
  @PrimaryGeneratedColumn() // 将 id 属性标记为主键列，并自动生成值
  id!: number

  @Column() // @Column是一个装饰器，将 name 属性映射到数据库中的一个列
  name!: string

  @Column()
  latitude!: string

  @Column()
  longitude!: string

  @Column({ type: 'tinyint', name: 'allows_pets'})
  allowsPets!: string

  @Column({ type: 'date', name: 'created_at' })
  createdAt!: string

  @Column({ type: 'date', name: 'updated_at' })
  updatedAt!: string
}
