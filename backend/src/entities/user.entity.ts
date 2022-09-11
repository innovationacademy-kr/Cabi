import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryColumn({
        type: 'int',
    })
    user_id: number;

    @Column({
        nullable: false,
        type: 'varchar',
        length: 30,
    })
    intra_id: string;

    @Column({
        default: false,
        type: 'tinyint',
    })
    auth: number;

    @Column({
        unique: true,
        type: 'varchar',
        length: 128,
    })
    email: string;

    @Column({
        unique: true,
        type: 'varchar',
        length: 128,
    })
    phone: string;

    @CreateDateColumn()
    first_login: Date;

    @UpdateDateColumn()
    last_login: Date;

    //추가될 column
    // @Column({
    //     type: 'boolean'
    // })
    // blackholed: boolean;
}