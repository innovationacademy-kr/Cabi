import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cabinet from './cabinet.entity';
import User from './user.entity';

@Entity('lent')
export default class Lent {
  @PrimaryGeneratedColumn({
    name: 'lent_id',
  })
  lent_id: number;

  @Column({
    name: 'lent_time',
    type: 'datetime',
  })
  lent_time: Date;

  @Column({
    name: 'expire_time',
    type: 'datetime',
  })
  expire_time: Date;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'lent_user_id',
  })
  lent_user_id: User;

  @OneToOne(() => Cabinet)
  @JoinColumn({
    name: 'lent_cabinet_id',
  })
  lent_cabinet_id: Cabinet;
}
