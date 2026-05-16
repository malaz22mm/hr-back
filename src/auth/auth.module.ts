import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategies';
// FIX: Import the Module, not the Service directly
import { EmailModule } from './email/email.module'; 

@Module({
  imports: [
      JwtModule.register({}), 
      EmailModule // Correct way to share EmailService
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [AuthService], // Export if other modules need to check auth status
})
export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger(AuthModule.name);

  onModuleInit(): void {
    this.logger.log('Authentication module initialized (JWT strategies registered)');
  }
}