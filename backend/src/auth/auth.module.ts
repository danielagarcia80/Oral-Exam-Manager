/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { MyJwtService } from './jwt.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret:
        process.env.JWT_SECRET ||
        'j18lBOrGklTDbCX1UwxAtrRynX9XBTVSNy5jZUZEoyz1RJhw1H7WtlWfe0jjShE6',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, MyJwtService],
  controllers: [AuthController],
  exports: [MyJwtService, AuthService],
})
export class AuthModule {}
