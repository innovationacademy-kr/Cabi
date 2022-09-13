import Lent_type from 'src/enums/lent.type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Cabinet {
  @PrimaryGeneratedColumn()
  cabinet_id: number;

  @Column({
    type: 'int',
  })
  cabinet_num: number;

  /**
   * TODO: location이나 section같은 경우는 enum으로 관리하는 것이 좋을 것 같습니다.
   */
  @Column({
    type: 'varchar',
    length: 30,
  })
  location: string;

  @Column({
    type: 'int',
  })
  floor: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  section: string;

  @Column({
    type: 'tinyint',
    default: true,
  })
  activation: number;

  /**
   * 새로 추가될 필드입니다.
   */
  // @Column({
  //     type: 'enum',
  // })
  // lent_type: Lent_type;

  // @Column({
  //     type: 'tinyint',
  //     default: 3,
  // })
  // max_user: number;

  // @Column({
  //     type: 'tinyint',
  //     default: 1,
  // })
  // min_user: number;

  // @Column({
  //     type: 'varchar',
  //     length: 50,
  // })
  // secret_memo: string;

  // @Column({
  //     type: 'varchar',
  //     length: 128,
  // })
  // title: string;
}
