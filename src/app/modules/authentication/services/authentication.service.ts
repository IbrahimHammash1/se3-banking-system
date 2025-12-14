import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationRepository } from "../repositories/authentication.repository";
import { LoginDto } from "../dtos/login-dto";
import { PasswordUtils } from "@common/utils/hashing/password.util";
import { JwtService } from "@nestjs/jwt";
import { LoginEntity } from "../entities/login.entity";
import { envConfig } from "@common/config/env-config";
import { TokenPayload } from "../constants";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _authenticationRepository: AuthenticationRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const actor = await this._authenticationRepository.findActorByEmail(
      loginDto.email,
    );
    if (!actor) {
      throw new UnauthorizedException();
    }
    if (
      !(await PasswordUtils.comparePasswords(loginDto.password, actor.password))
    ) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.createToken({
      id: actor.id,
      role: actor.role,
    });
    const viewActor = await this._authenticationRepository.findViewActorByEmail(
      actor.email,
    );
    return LoginEntity.createInstance({ accessToken, actor: viewActor! });
  }

  async createToken(actor: TokenPayload) {
    const payload: TokenPayload = { id: actor.id, role: actor.role };
    return this._jwtService.signAsync(payload);
  }

  async extractToken(token: string): Promise<TokenPayload> {
    return this._jwtService.verifyAsync(token, {
      secret: envConfig.JWT_SECRET,
    });
  }
}
