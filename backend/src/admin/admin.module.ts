import { Module } from "@nestjs/common";
import { AdminLentModule } from "src/admin/lent/lent.module";
import { AdminLogModule } from "src/admin/log/log.module";
import { AdminAuthModule } from "./auth/auth.module";
import { CabinetModule } from "./cabinet/cabinet.module";
import { ReturnModule } from "./return/return.module";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    AdminAuthModule,
    AdminLentModule,
    AdminLogModule,
    CabinetModule,
    ReturnModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
