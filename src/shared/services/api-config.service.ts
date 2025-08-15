import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get baseUrl(): string {
    return (
      this.configService.get<string>("api.baseUrl") || "http://localhost:3001"
    );
  }

  buildUrl(path: string, request?: any): string {
    const baseUrl = this.baseUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  }
}
