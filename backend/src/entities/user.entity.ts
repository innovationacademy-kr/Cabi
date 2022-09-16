import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export default class User {
  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
  })
  user_id: number;

  @Column({
    name: 'intra_id',
    nullable: false,
    type: 'varchar',
    length: 32,
  })
  intra_id: string;

  @Column({
    name: 'auth',
    default: false,
    type: 'tinyint',
  })
  auth: number;

  @Column({
    name: 'email',
    unique: true,
    type: 'varchar',
    length: 128,
  })
  email: string;

  @Column({
    name: 'phone',
    unique: true,
    type: 'varchar',
    length: 128,
  })
  phone: string;

  @CreateDateColumn({
    name: 'first_login',
  })
  first_login: Date;

  @UpdateDateColumn({
    name: 'last_login',
  })
  last_login: Date;

  @Column({
    name: 'is_lent',
    type: 'boolean',
    default: false,
  })
  is_lent: boolean;
}
