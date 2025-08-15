import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import * as path from "path";
import configuration from "./config/configuration";
import {
  I18nModule,
  AcceptLanguageResolver,
  I18nJsonLoader,
} from "nestjs-i18n";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { BusinessesModule } from "./modules/businesses/businesses.module";
import { RemindersModule } from "./modules/reminders/reminders.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { ServicesModule } from "./modules/services/services.module";
import { ProfilesModule } from "./modules/profiles/profiles.module";
import { RolesModule } from "./modules/roles/roles.module";
import { CreditsModule } from "./modules/credits/credits.module";
import { AuditModule } from "./modules/audit/audit.module";
import { ProductsModule } from "./modules/products/products.module";
import { FinancialRecordsModule } from "./modules/financial-records/financial-records.module";
import { NotificationTemplatesModule } from "./modules/notification-templates/notification-templates.module";
import { SharedServicesModule } from "./shared/services/shared-services.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: "pt",
      loaders: [
        new I18nJsonLoader({
          path: path.join(__dirname, "/i18n/"),
        }),
      ],
      resolvers: [AcceptLanguageResolver],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    CustomersModule,
    BusinessesModule,
    RemindersModule,
    SubscriptionsModule,
    ServicesModule,
    ProfilesModule,
    RolesModule,
    CreditsModule,
    AuditModule,
    ProductsModule,
    FinancialRecordsModule,
    NotificationTemplatesModule,
    SharedServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
