import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AccountStatus, Language, Role } from "@prisma/client";
import { ClsService } from "nestjs-cls";
import { I18nService } from "nestjs-i18n";
import { TokenPayload } from "src/app/modules/authentication/constants";
import { I18nPath } from "src/generated/i18n.generated";

@Injectable()
export class GlobalFacadeService {
  constructor(
    private readonly _transactionHostService: TransactionHost<TransactionalAdapterPrisma>,
    public readonly clsService: ClsService,
    private readonly i18n: I18nService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  get prismaService() {
    return this._transactionHostService.tx;
  }
  get prismaTransactionService() {
    return this._transactionHostService;
  }

  async setActorContext(actorId: string) {
    const actor = await this.prismaService.actor.findUnique({
      where: { id: actorId },
      select: {
        id: true,
        role: true,
        accountStatus: true,
      },
    });
    if (!actor) {
      throw new UnauthorizedException();
    }
    if (actor.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenException("Your account is not activated");
    }
    this.setClsService({
      id: actor.id,
      role: actor.role,
      accountStatus: actor.accountStatus,
    });
  }

  setClsService(
    actor: TokenPayload & {
      accountStatus: AccountStatus;
    },
  ) {
    this.clsService.set("actorId", actor.id);
    this.clsService.set("role", actor.role);
    this.clsService.set("accountStatus", actor.accountStatus);
  }

  get actorId(): string {
    return this.clsService.get("actorId");
  }

  get role(): Role {
    return this.clsService.get("role");
  }

  get accountStatus(): AccountStatus {
    return this.clsService.get("accountStatus");
  }

  get language(): Language {
    return this.clsService.get("language");
  }

  setLanguageFromHeader(lang: Language) {
    this.clsService.set("language", lang);
  }

  translate<T extends I18nPath>(
    key: T,
    lang?: Language,
    args?: Record<string, any>,
  ): Promise<string> {
    return this.i18n.translate(key, { lang: lang ?? this.language, args });
  }
}
