import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Event {
    @PrimaryColumn({
        type: 'int',
    })
    Key: number;
}