import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import BanLog from './ban.log.entity';
import Lent from './lent.entity';
import LentLog from './lent.log.entity';

@Entity('user')
export default class User {
  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
  })
  user_id: number;

  @Column({
    name: 'intra_id',
    unique: true,
    type: 'varchar',
    length: 32,
  })
  intra_id: string;

  @Column({
    name: 'state',
    default: 0,
    type: 'tinyint',
  })
  auth: number;

  @Column({
    name: 'email',
    unique: true,
    nullable: true,
    type: 'varchar',
    length: 128,
  })
  email: string;

  @Column({
    name: 'phone',
    unique: true,
    nullable: true,
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

  @OneToOne(() => Lent, (lent) => lent.lent_user_id)
  lent: Lent[];

  @OneToMany(() => BanLog, (banLog) => banLog.ban_user_id)
  BanLog: BanLog[];

  @OneToMany(() => LentLog, (lentLog) => lentLog.log_user_id)
  LentLog: LentLog[];
}
