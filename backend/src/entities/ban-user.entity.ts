import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class BanUser {
    @PrimaryGeneratedColumn()
    ban_id: number;
}