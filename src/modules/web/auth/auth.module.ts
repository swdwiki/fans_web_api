import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, JwtService, JwtStrategy],
  exports: [AuthService],
  imports: [PassportModule, JwtModule],
})
export class AuthModule {}
