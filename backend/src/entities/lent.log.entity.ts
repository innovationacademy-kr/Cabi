import Lent_type from 'src/enums/lent.type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class LentLog {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column({
    type: 'int',
  })
  log_user_id: number;

  @Column({
    type: 'int',
  })
  log_cabinet_id: number;

  @Column({
    type: 'datetime',
  })
  lent_time: Date;

  @Column({
    type: 'datetime',
  })
  return_time: Date;

  @Column({
    type: 'enum',
  })
  lent_type: Lent_type;
}
