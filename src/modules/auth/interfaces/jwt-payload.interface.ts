export interface JwtPayload {
  sub: string;
  email: string;
  businessId: string;
  businessRole: string;
  systemRole: string;
  deviceId: string;
  iat?: number;
  exp?: number;
}
