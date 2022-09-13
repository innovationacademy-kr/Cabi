import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class BanUser {
  @PrimaryGeneratedColumn()
  ban_id: number;

  @Column({
    nullable: false,
    type: 'int',
  })
  ban_user_id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 30,
  })
  intra_id: string;

  @Column({
    type: 'int',
  })
  cabinet_id: number;

  @Column({
    type: 'datetime',
  })
  banned_date: Date;

  @Column({
    type: 'datetime',
  })
  unbanned_date: Date;
}
