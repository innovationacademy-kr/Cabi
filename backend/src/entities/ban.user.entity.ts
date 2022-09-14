import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export default class BanUser {
  @PrimaryGeneratedColumn({
    name: 'ban_id',
  })
  ban_id: number;

  @Column({
    name: 'ban_user_id',
    nullable: false,
    type: 'int',
  })
  ban_user_id: number;

  @Column({
    name: 'intra_id',
    nullable: false,
    type: 'varchar',
    length: 30,
  })
  intra_id: string;

  @Column({
    name: 'cabinet_id',
    type: 'int',
  })
  cabinet_id: number;

  @Column({
    name: 'banned_date',
    type: 'datetime',
  })
  banned_date: Date;

  @Column({
    name: 'unbanned_date',
    type: 'datetime',
  })
  unbanned_date: Date;
}
