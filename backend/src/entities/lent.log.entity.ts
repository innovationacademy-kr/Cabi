import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cabinet from './cabinet.entity';
import User from './user.entity';

@Entity('lent_log')
export default class LentLog {
  @PrimaryGeneratedColumn({
    name: 'log_id',
  })
  log_id: number;

  @Column({
    name: 'log_user_id',
    type: 'int',
  })
  log_user_id: number;

  @Column({
    name: 'log_cabinet_id',
    type: 'int',
  })
  log_cabinet_id: number;

  @Column({
    name: 'lent_time',
    type: 'datetime',
  })
  lent_time: Date;

  @Column({
    name: 'return_time',
    type: 'datetime',
  })
  return_time: Date;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({
    name: 'log_user_id',
  })
  user: User;

  @ManyToOne(() => Cabinet, (cabinet) => cabinet.cabinet_id)
  @JoinColumn({
    name: 'log_cabinet_id',
  })
  cabinet: Cabinet;
}
