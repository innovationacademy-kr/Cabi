import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Cabinet from './cabinet.entity';
import User from './user.entity';

@Entity('ban_log')
export default class BanUser {
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

  @OneToOne(() => User)
  @JoinColumn({
    name: 'ban_user_id',
  })
  ban_user_id: User;

  @OneToOne(() => Cabinet)
  @JoinColumn({
    name: 'ban_cabinet_id',
  })
  ban_cabinet_id: Cabinet;
}
