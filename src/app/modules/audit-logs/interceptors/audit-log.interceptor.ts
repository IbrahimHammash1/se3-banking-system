import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable, catchError, map } from "rxjs";
import { AuditLogsService } from "../services/audit-logs.service";
import { GlobalFacadeService } from "../../../../core/modules/global-facade/services/global-facade.service";

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly _auditLogsService: AuditLogsService,
    private readonly _globalFacadeService: GlobalFacadeService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const { method, originalUrl: url, params, query, body } = request;

    const startTime = Date.now();
    this.logger.verbose(
      `Incoming request: ${method} ${url} at ${new Date(startTime).toISOString()}`,
    );

    const userId = this._globalFacadeService.actorId ?? null;
    const ip = request.ip ?? request.headers["x-forwarded-for"];
    const userAgent = request.headers["user-agent"];
    const platform = request.headers["sec-ch-ua-platform"];

    return next.handle().pipe(
      map(async (response) => {
        const duration = Date.now() - startTime;

        this.logger.debug(
          `Request handled in ${duration}ms - ${method} ${url} - Success`,
        );
        if (method !== "GET") {
          await this._auditLogsService.create({
            userId,
            url,
            method,
            ip,
            userAgent,
            platform,
            params,
            query,
            body,
            response,
            statusCode: http.getResponse().statusCode,
            duration: `${duration}ms`,
          });
        }

        return response;
      }),

      catchError(async (error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `Request failed after ${duration}ms - ${method} ${url} - Error: ${error.message}`,
        );

        await this._auditLogsService.create({
          userId,
          url,
          method,
          ip,
          userAgent,
          platform,
          params,
          query,
          body,
          response: {},
          statusCode: error.status ?? 500,
          errorMessage: error.message,
          errorStack: error.stack,
          duration: `${duration}ms`,
        });
        throw error;
      }),
    );
  }
}
