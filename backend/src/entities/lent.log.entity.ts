import LentType from 'src/enums/lent.type.enum';
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
    name: 'lent_time',
    type: 'datetime',
  })
  lent_time: Date;

  @Column({
    name: 'return_time',
    type: 'datetime',
  })
  return_time: Date;

  @Column({
    name: 'lent_type',
    type: 'enum',
  })
  lent_type: LentType;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({
    name: 'log_user_id',
  })
  log_user_id: User;

  @ManyToOne(() => Cabinet, (cabinet) => cabinet.cabinet_id)
  @JoinColumn({
    name: 'log_cabinet_id',
  })
  log_cabinet_id: Cabinet;
}
