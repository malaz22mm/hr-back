import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from './types/jwtPayload.type';
import { jwtPayloadWithRt } from './types/jwtPayloadWithRt.type';
import { VerifingDto } from './dto/verification.dto';
import { AtAuthorizationHeader } from '../common/decorators/at-authorization.decorator';
import { UserIdDto } from './dto/resend-verification-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MyPublic } from '../common/decorators/public.decorator';
import { TokensDto, VerificationRequiredDto } from '../common/dto/tokens.dto';

interface LogoutRequest extends Request {
  user: JwtPayload;
}
interface RefreshRequest extends Request {
  user: jwtPayloadWithRt;
}

@ApiTags('Auth')
@ApiExtraModels(TokensDto, VerificationRequiredDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MyPublic()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in using email or phone',
    description: 'Provide **email** OR **phone** plus password. Returns JWT tokens when verified, or a verification payload when `approvalState` is NOT_VERIFIED.',
  })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    description: 'Sign-in successful',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(TokensDto) },
        { $ref: getSchemaPath(VerificationRequiredDto) },
      ],
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Resend cooldown or access denied' })
  async signinLocal(@Body() dto: SignInDto) {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @AtAuthorizationHeader()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout — invalidate refresh token server-side' })
  @ApiNoContentResponse({ description: 'Logged out successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid access token' })
  logout(@Req() req: LogoutRequest): Promise<void> {
    const user = req.user;
    return this.authService.logout(user['sub']);
  }

  @MyPublic()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rotate access and refresh tokens',
    description: 'Send `Authorization: Bearer <refresh_token>`. Both tokens are rotated; old refresh token is invalidated.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer refresh_token (not access token)',
    required: true,
    example: 'Bearer <refresh_token>',
  })
  @ApiOkResponse({ type: TokensDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Invalid, expired, or revoked refresh token' })
  refreshTokens(@Req() req: RefreshRequest): Promise<TokensDto> {
    const user = req.user;
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @MyPublic()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify account with email OTP' })
  @ApiBody({ type: VerifingDto })
  @ApiOkResponse({ type: TokensDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Wrong or expired verification code' })
  verifyAccount(@Body() dto: VerifingDto): Promise<TokensDto> {
    return this.authService.verifyAccount(dto);
  }

  @MyPublic()
  @Post('resend-verification-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Resend email verification OTP' })
  @ApiBody({ type: UserIdDto })
  @ApiNoContentResponse({ description: 'Verification code sent' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User not found or cooldown active' })
  async resendVerificationCode(@Body() dto: UserIdDto): Promise<void> {
    await this.authService.sendVerificationCode(dto.userId);
  }

  @MyPublic()
  @Post('request-reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request password reset OTP (same flow as verification email)' })
  @ApiBody({ type: UserIdDto })
  @ApiNoContentResponse({ description: 'Reset code sent to email' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User not found or cooldown active' })
  async requestResetPassword(@Body() dto: UserIdDto): Promise<void> {
    await this.authService.sendVerificationCode(dto.userId);
  }

  @MyPublic()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reset password using OTP from email' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiNoContentResponse({ description: 'Password updated' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Invalid code, email mismatch, or user not found' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto);
  }
}
