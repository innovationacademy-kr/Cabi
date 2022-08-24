import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public sendMail(email: string, subject: string, file: string): void {
        this.mailerService.sendMail({
            from: `42CABI ${process.env.MAIL_FROM}`,
            to: email,
            subject: subject,
            template: `./${file}`,
        })
        .then((success) => {
            console.log(success);
        })
        .catch((err) => {
            console.log(err);
        });
    }
}
