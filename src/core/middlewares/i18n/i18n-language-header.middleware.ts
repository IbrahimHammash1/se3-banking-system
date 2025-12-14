import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Language } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(private readonly globalFacadeService: GlobalFacadeService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers["accept-language"]?.split(",")[0] || "en";
    const isValidLang = Object.values(Language).includes(lang as Language);
    const languageToSet = isValidLang ? (lang as Language) : "en";
    this.globalFacadeService.setLanguageFromHeader(languageToSet);
    next();
  }
}
