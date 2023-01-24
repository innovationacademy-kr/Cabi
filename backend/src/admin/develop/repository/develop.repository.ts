import { InjectRepository } from "@nestjs/typeorm";
import { IAdminDevelopRepository } from "src/admin/develop/repository/develop.repository.interface";
import { AdminUserDto } from "src/admin/dto/admin.user.dto";
import AdminUserRole from "src/admin/enums/admin.user.role.enum";
import AdminUser from "src/entities/admin.user.entity";
import { Repository } from "typeorm";

export class AdminDevelopRepository implements IAdminDevelopRepository {
    constructor(
        @InjectRepository(AdminUser)
        private adminDevelopRepository: Repository<AdminUser>,
    ) {}

    async setUserToAdmin(adminUser: AdminUserDto): Promise<boolean> {
        const find = await this.adminDevelopRepository.findOne({
            where: {
                email: adminUser.email,
            },
        });
        if (!find) {
            return false;
        }
        await this.adminDevelopRepository
        .createQueryBuilder()
        .update(AdminUser)
        .set({
            role: AdminUserRole.ADMIN,   
        })
        .where({
            email: adminUser.email,
        })
        .execute();
        return true;
    }
}