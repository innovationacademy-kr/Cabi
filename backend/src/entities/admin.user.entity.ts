import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('admin_user')
export default class AdminUser {
  @PrimaryColumn({
    name: 'google_id',
    type: 'varchar',
  })
  google_id: string;

  @Column({
    name: 'email',
    unique: true,
    nullable: false,
    type: 'varchar',
    length: 128,
  })
  email: string;

  @Column({
    name: 'role',
    nullable: false,
    type: 'tinyint',
    default: 0,
  })
  role: number;
}
