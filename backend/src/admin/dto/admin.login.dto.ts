import { IsNotEmpty } from "class-validator";

export class AdminLoginDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    password: string;
}
