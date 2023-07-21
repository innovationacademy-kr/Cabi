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
    name: 'log_intra_id',
    unique: true,
    type: 'varchar',
    length: 32,
  })
  log_intra_id: string;

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
}
