import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

@Entity('ban_log')
export default class BanLog {
  @PrimaryGeneratedColumn({
    name: 'ban_log_id',
  })
  ban_log_id: number;

  @Column({
    name: 'ban_user_id',
    type: 'int',
  })
  ban_user_id: number;

  @Column({
    name: 'ban_cabinet_id',
    type: 'int',
  })
  ban_cabinet_id: number;

  @Column({
    name: 'banned_date',
    type: 'datetime',
  })
  banned_date: Date;

  @Column({
    name: 'unbanned_date',
    type: 'datetime',
  })
  unbanned_date: Date;

  @Column({
    name: 'is_penalty',
    type: 'boolean',
  })
  is_penalty: boolean;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({
    name: 'ban_user_id',
  })
  user: User;
}
