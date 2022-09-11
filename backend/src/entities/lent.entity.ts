import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cabinet from './cabinet.entity';
import User from './user.entity';

@Entity()
export default class Lent {
  @PrimaryGeneratedColumn()
  lent_id: number;

  @Column({
    type: 'datetime',
  })
  lent_time: Date;

  @Column({
    type: 'datetime',
  })
  expire_time: Date;

  /**
   * 기존 ERD에는 존재하나 삭제하고 수정할 부분입니다.
   * TODO: extension 삭제
   * TODO: lent_user_id와 lent_cabinet_id FK 삭제
   */
  @Column({
    default: false,
  })
  extension: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  lent_user_id: User;

  @OneToOne(() => Cabinet)
  @JoinColumn()
  lent_cabinet_id: Cabinet;
}
