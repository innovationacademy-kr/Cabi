import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Cabinet {
    @PrimaryGeneratedColumn()
    cabinet_id: number;
}