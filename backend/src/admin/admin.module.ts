import { Module } from "@nestjs/common";
import { AdminCabinetModule } from "src/admin/cabinet/cabinet.module";
import { AdminLentModule } from "src/admin/lent/lent.module";
import { AdminLogModule } from "src/admin/log/log.module";
import { AdminAuthModule } from "src/admin/auth/auth.module";
import { AdminReturnModule } from "./return/return.module";
import { AdminSearchModule } from "./search/search.module";

@Module({
  imports: [
    AdminAuthModule,
    AdminLentModule,
    AdminLogModule,
    AdminCabinetModule,
    AdminSearchModule,
    AdminReturnModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
