import { ClsModuleOptions } from "nestjs-cls";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { PrismaModule } from "src/core/modules/prisma/prisma.module";
import { PrismaService } from "src/core/modules/prisma/services/prisma.service";

export const clsOptions: ClsModuleOptions = {
  global: true,
  middleware: { mount: true },
  guard: { mount: true },
  plugins: [
    new ClsPluginTransactional({
      imports: [PrismaModule],
      adapter: new TransactionalAdapterPrisma({
        prismaInjectionToken: PrismaService,
      }),
    }),
  ],
} as const;
