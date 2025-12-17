import { GlobalFacadeService } from "@core/modules/global-facade/services/global-facade.service";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly _globalFacadeService: GlobalFacadeService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = await ctx.getResponse<any>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const { method, originalUrl: url } = request;
    const userId = this._globalFacadeService.actorId ?? null;

    const ip = request.ip ?? request.headers["x-forwarded-for"];
    const userAgent = request.headers["user-agent"];
    const platform = request.headers["sec-ch-ua-platform"];

    if (status !== 429) {
      response.status(status).json(errorResponse);
    }
    if (status === 429) {
      response.status(429).json({
        statusCode: 429,
        message: "Too Many Requests - You have exceeded the request limit.",
        error: "Rate limit exceeded",
      });
    }
  }
}
