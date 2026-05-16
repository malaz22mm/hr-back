import { Controller, Get, Redirect } from '@nestjs/common';
import { MyPublic } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @MyPublic()
  @Get()
  root() {
    return {
      message: 'Talabaty HR API',
      swagger: '/docs',
      openApiJson: '/docs-json',
      legacySpecFile: '/swagger-spec.json',
    };
  }

  /** Alias for local swagger-spec.json — same OpenAPI document as /docs-json */
  @MyPublic()
  @Get('swagger-spec.json')
  @Redirect('/docs-json', 302)
  swaggerSpecRedirect(): void {}

  @MyPublic()
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
