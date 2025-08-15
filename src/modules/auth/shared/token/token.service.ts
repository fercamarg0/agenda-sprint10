import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
interface DecodedTokenPayload {
  exp: number;
}
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async generateTokens(payload: {
    sub: string;
    email: string;
    businessId: string;
    role: string;
    systemRole: string;
    deviceId?: string;
  }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("jwt.accessSecret"),
      expiresIn: this.configService.get<string>("jwt.accessExpiresIn"),
    });
    const refreshToken = await this.jwtService.signAsync(
      { sub: payload.sub, businessId: payload.businessId },
      {
        secret: this.configService.get<string>("jwt.refreshSecret"),
        expiresIn: this.configService.get<string>("jwt.refreshExpiresIn"),
      },
    );
    const decodedToken = this.jwtService.decode(accessToken);
    const accessTokenExpiresAt = new Date(decodedToken.exp * 1000);
    return { accessToken, refreshToken, accessTokenExpiresAt };
  }
}
