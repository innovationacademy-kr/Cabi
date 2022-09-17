import LentType from 'src/enums/lent.type.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Lent from './lent.entity';

@Entity('cabinet')
export default class Cabinet {
  @PrimaryGeneratedColumn({
    name: 'cabinet_id',
  })
  @OneToMany(() => Lent, (lent) => lent.lent_cabinet_id)
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
    name: 'activation',
    type: 'tinyint',
    default: 1,
  })
  activation: number;

  @Column({
    name: 'lent_type',
    type: 'enum',
    default: LentType.PRIVATE,
  })
  lent_type: LentType;

  @Column({
    name: 'max_user',
    type: 'tinyint',
    default: 3,
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
}
