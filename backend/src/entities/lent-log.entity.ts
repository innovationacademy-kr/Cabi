import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class LentLog {
    @PrimaryGeneratedColumn()
    log_id: number;
}