import { Module } from "@nestjs/common";
import { AdminAuthModule } from "./auth/auth.module";
import { CabinetModule } from "./cabinet/cabinet.module";
import { LentModule } from "./lent/lent.module";
import { LogModule } from "./log/log.module";
import { ReturnModule } from "./return/return.module";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    AdminAuthModule,
    CabinetModule,
    LentModule,
    LogModule,
    ReturnModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
