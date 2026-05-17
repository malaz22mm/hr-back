import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprState, UserRole } from '../../../generated/prisma/enums';

/** Safe user shape for API responses (excludes password hashes). */
export class UserResponseDto {
  @ApiProperty({ example: '24b5d2c3-3da5-4d6e-9a4e-f088c75433f2' })
  id: string;

  @ApiProperty({ example: 'Jane Admin' })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;

  @ApiProperty({ enum: ApprState, example: ApprState.VERIFIED })
  approvalState: ApprState;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiPropertyOptional({ example: '+963911111111' })
  phone?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
