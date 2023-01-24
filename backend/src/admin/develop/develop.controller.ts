import { Controller, ForbiddenException, Get, Inject, Logger, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AdminAuthService } from "src/admin/auth/auth.service";
import { AdminDevelopService } from "src/admin/develop/develop.service";
import AdminUserRole from "src/admin/enums/admin.user.role.enum";

@ApiTags('Develop')
@Controller('/api/admin/develop')
export class AdminDevelopController {
    private logger = new Logger(AdminDevelopController.name);
    constructor(
        private adminDevelopService: AdminDevelopService,
        private adminAuthService: AdminAuthService,
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
            this.logger.log(`failed promote ${email} to admin due to environment : not dev.`);
            throw new ForbiddenException('setUserToAdminByEmail API can use only in dev.');
        }
        if (await this.adminAuthService.checkUserExists(email) !== true) {
            this.logger.log(`failed promote ${email} to admin due to never had tried admin log-in.`);
            throw new ForbiddenException(`${email} doesn't exist in admin_user table.`);
        }
        if (await this.adminAuthService.getAdminUserRole(email) === AdminUserRole.ROOT_ADMIN) {
            this.logger.log(`request failed due to trying to demote root admin.`);
            throw new ForbiddenException(`can't set ${email}'s role to admin : root admin.`);
        }
        await this.adminDevelopService.setUserToAdminByEmail(email);
        this.logger.log(`${email} has self-promoted to admin.`);
        return res.redirect(`${this.configService.get<string>('fe_host')}/api/admin/auth/login`);
    }
}