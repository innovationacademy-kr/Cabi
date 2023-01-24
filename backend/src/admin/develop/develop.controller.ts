import { Controller, ForbiddenException, Get, Inject, Logger, Req, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GoogleOAuthGuard } from "src/admin/auth/google/guard/google.guard";
import { AdminDevelopService } from "src/admin/develop/develop.service";
import { AdminUserDto } from "src/admin/dto/admin.user.dto";
import { User } from "src/decorator/user.decorator";

@ApiTags('Develop')
@Controller('/api/admin/develop')
export class AdminDevelopController {
    private logger = new Logger(AdminDevelopController.name);
    constructor(
        private adminDevelopService: AdminDevelopService,
        @Inject(ConfigService) private configService: ConfigService,
    ) {}

    @ApiOperation({
        summary: 'Dev에서 본인을 관리자로 승격시키는 요청입니다.'
    })
    @Get('/promote')
    @UseGuards(GoogleOAuthGuard)
    async selfPromoteToAdmin(@User() adminUser: AdminUserDto) {
        if (this.configService.get<boolean>('dev') !== true) {
            this.logger.log(`${adminUser.email} tried self-promote but failed due to environment.`);
            throw new ForbiddenException('This API can use only in dev.');
        }
        this.logger.log(`${adminUser.email} has self-promoted`);
        await this.adminDevelopService.setUserToAdmin(adminUser);
    }
}