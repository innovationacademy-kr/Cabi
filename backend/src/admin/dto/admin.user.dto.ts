import { ApiProperty } from "@nestjs/swagger";

export class AdminUserDto {
    @ApiProperty({
        description: '구글 이메일',
        example: '42cabi@gmail.com',
    })
    email: string;

    @ApiProperty({
        default: 0,
        description: '관리자 권한 수준',
        example: '0',
    })
    role: number;
}