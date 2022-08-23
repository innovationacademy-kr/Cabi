import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./email.service";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: process.env.MAIL_SERVICE,
                host: process.env.MAIL_HOST,
                port: 465,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                },
                secure: true,
                tls: {
                    maxVersion: process.env.MAIL_TLS_MAXVERSION,
                    minVersion: process.env.MAIL_TLS_MINVERSION,
                    ciphers: process.env.MAIL_TLS_CIPHERS,
                }
            }
        }),
    ],
    
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
