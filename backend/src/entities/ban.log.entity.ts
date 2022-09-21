import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cabinet from './cabinet.entity';
import User from './user.entity';

@Entity('ban_log')
export default class BanLog {
  @PrimaryGeneratedColumn({
    name: 'ban_id',
  })
  ban_id: number;

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

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({
    name: 'ban_user_id',
  })
  ban_user_id: User;

  @ManyToOne(() => Cabinet, (cabinet) => cabinet.cabinet_id)
  @JoinColumn({
    name: 'ban_cabinet_id',
  })
  ban_cabinet_id: Cabinet;
}
