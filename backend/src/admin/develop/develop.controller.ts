import { Controller, ForbiddenException, Get, Inject, Logger, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AdminDevelopService } from "src/admin/develop/develop.service";

@ApiTags('Develop')
@Controller('/api/admin/develop')
export class AdminDevelopController {
    private logger = new Logger(AdminDevelopController.name);
    constructor(
        private adminDevelopService: AdminDevelopService,
        @Inject(ConfigService) private configService: ConfigService,
    ) {}

    @ApiOperation({
        summary: 'Dev에서 본인을 관리자로 승격시키는 요청입니다.',
        description: 'email을 param으로 입력하면, 해당 이메일이 존재할 때 role을 1(Admin)으로 설정, 어드민 로그인으로 리다이렉트합니다.',
    }) 
    @Get('/promote')
    async setUserToAdminByEmail(
        @Res() res: Response, 
        @Query('email') email: string
        )  {
        if (this.configService.get<boolean>('is_dev') !== true) {
            this.logger.log(`${email} tried self-promote but failed due to environment.`);
            throw new ForbiddenException('setUserToAdminByEmail API can use only in dev.');
        }
        this.logger.log(`${email} has self-promoted to admin.`);
        await this.adminDevelopService.setUserToAdminByEmail(email);
        return res.redirect(`${this.configService.get<string>('fe_host')}/api/admin/auth/login`);
    }
}