import Lent_type from 'src/enums/lent.type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({
    name: 'lent_type',
    type: 'enum',
  })
  lent_type: Lent_type;
}
