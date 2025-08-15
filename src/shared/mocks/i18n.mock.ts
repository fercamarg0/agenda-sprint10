import { Injectable } from "@nestjs/common";
@Injectable()
export class I18nServiceMock {
  translate(key: string): Promise<string> {
    return Promise.resolve(`[MOCK] ${key}`);
  }
  t(key: string): Promise<string> {
    return this.translate(key);
  }
  resolveLanguage(lang: string): string {
    return lang || "pt";
  }
  getSupportedLanguages(): string[] {
    return ["pt", "en", "es", "pt-PT"];
  }
  async refresh(): Promise<void> {}
}
export const I18nServiceMockProvider = {
  provide: "I18nService",
  useClass: I18nServiceMock,
};
