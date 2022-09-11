import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export default class Lent {
    @PrimaryGeneratedColumn()
    lent_id: number;

    @OneToOne(() => User)
    @JoinColumn()
    lent_user_id: User;
}