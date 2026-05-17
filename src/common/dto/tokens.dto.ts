import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLXV1aWQiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4ifQ.signature',
  })
  access_token: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLXV1aWQiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4ifQ.signature',
  })
  refresh_token: string;
}

export class VerificationRequiredDto {
  @ApiProperty({
    description: 'User UUID — pass to POST /auth/verify or resend-verification-code',
    example: '24b5d2c3-3da5-4d6e-9a4e-f088c75433f2',
  })
  verificationId: string;

  @ApiProperty({
    example: 'Email verification required. Code sent.',
  })
  message: string;
}
