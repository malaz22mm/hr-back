import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MyPublic } from './common/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  @MyPublic()
  @Get()
  @ApiOperation({ summary: 'API root — links to docs and health' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Talabaty HR API',
        swagger: '/docs',
        openApiJson: '/docs-json',
        legacySpecFile: '/swagger-spec.json',
      },
    },
  })
  root() {
    return {
      message: 'Talabaty HR API',
      swagger: '/docs',
      openApiJson: '/docs-json',
      legacySpecFile: '/swagger-spec.json',
    };
  }

  @MyPublic()
  @Get('swagger-spec.json')
  @Redirect('/docs-json', 302)
  @ApiOperation({ summary: 'Redirect to OpenAPI JSON (legacy path)' })
  swaggerSpecRedirect(): void {}

  @MyPublic()
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ schema: { example: { status: 'ok' } } })
  health() {
    return { status: 'ok' };
  }
}
