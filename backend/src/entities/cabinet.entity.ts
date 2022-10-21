import LentType from 'src/enums/lent.type.enum';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Lent from './lent.entity';

@Entity('cabinet')
export default class Cabinet {
  @PrimaryGeneratedColumn({
    name: 'cabinet_id',
  })
  cabinet_id: number;

  @Column({
    name: 'cabinet_num',
    type: 'int',
  })
  cabinet_num: number;

  @Column({
    name: 'location',
    type: 'varchar',
    length: 32,
  })
  location: string;

  @Column({
    name: 'floor',
    type: 'int',
  })
  floor: number;

  @Column({
    name: 'section',
    type: 'varchar',
    length: 32,
  })
  section: string;

  @Column({
    name: 'cabinet_status',
    type: 'enum',
    enum: CabinetStatusType,
  })
  status: CabinetStatusType;

  @Column({
    name: 'lent_type',
    type: 'enum',
    enum: LentType,
  })
  lent_type: LentType;

  @Column({
    name: 'max_user',
    type: 'tinyint',
  })
  max_user: number;

  @Column({
    name: 'min_user',
    type: 'tinyint',
    default: 0,
  })
  min_user: number;

  @Column({
    name: 'memo',
    nullable: true,
    type: 'varchar',
    length: 64,
  })
  memo: string;

  @Column({
    name: 'title',
    nullable: true,
    type: 'varchar',
    length: 64,
  })
  title: string;

  @OneToMany(() => Lent, (lent) => lent.cabinet)
  lent: Lent[];
}
