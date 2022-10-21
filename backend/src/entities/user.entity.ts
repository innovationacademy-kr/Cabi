import UserStateType from 'src/enums/user.state.type.enum';
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
    type: 'enum',
    enum: UserStateType,
    default: UserStateType.NORMAL,
  })
  state: UserStateType;

  @Column({
    name: 'email',
    unique: true,
    nullable: true,
    type: 'varchar',
    length: 128,
  })
  email: string;

  @CreateDateColumn({
    name: 'first_login',
  })
  first_login: Date;

  @UpdateDateColumn({
    name: 'last_login',
  })
  last_login: Date;

  @Column({
    name: 'blackhole_date',
    nullable: true,
    type: 'datetime',
  })
  blackhole_date: Date | null;

  @OneToMany(() => BanLog, (banLog) => banLog.user)
  BanLog: BanLog[];

  @OneToOne(() => Lent, (lent) => lent.user)
  Lent: Lent | null;
}
