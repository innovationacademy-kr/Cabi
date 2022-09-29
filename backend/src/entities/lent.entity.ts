import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
    name: 'lent_user_id',
    type: 'int',
  })
  lent_user_id: number;

  @Column({
    name: 'lent_cabinet_id',
    type: 'int',
  })
  lent_cabinet_id: number;

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
  user: User;

  @ManyToOne(() => Cabinet, (cabinet) => cabinet.cabinet_id)
  @JoinColumn({
    name: 'lent_cabinet_id',
  })
  cabinet: Cabinet;
}
