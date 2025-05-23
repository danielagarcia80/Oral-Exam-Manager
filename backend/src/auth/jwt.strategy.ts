// Lint was being incredibly frustrating with this file
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  id: string;
  email: string;
  role: 'INSTRUCTOR' | 'STUDENT' | 'ADMIN';
  name: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const rawSecret = configService.get<string>('JWT_SECRET');

    if (!rawSecret || typeof rawSecret !== 'string') {
      throw new Error('JWT_SECRET is not defined or is not a string.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: rawSecret,
    });
  }

  validate(payload: JwtPayload) {
    return {
      user_id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
