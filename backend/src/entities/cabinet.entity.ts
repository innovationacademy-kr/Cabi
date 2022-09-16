import Lent_type from 'src/enums/lent.type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    name: 'activation',
    type: 'tinyint',
    default: true,
  })
  activation: number;

  @Column({
    name: 'lent_type',
    type: 'enum',
    default: 'PRIVATE',
  })
  lent_type: Lent_type;

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
      type: 'varchar',
      length: 64,
  })
  memo: string;

  @Column({
    name: 'title',
      type: 'varchar',
      length: 64,
  })
  title: string;
}
