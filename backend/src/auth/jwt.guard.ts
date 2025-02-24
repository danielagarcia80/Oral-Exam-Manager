/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenStrategy } from '../token/token.strategy';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private tokenStrategy: TokenStrategy,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      Logger.log('Public Accessed');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const url = request.url;
    const method = request.method;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Authorization header missing or malformed');
    }

    const bearerToken = authHeader.slice(7);

    Logger.log('Auth Requested: Token');
    return from(this.tokenStrategy.verifyToken(bearerToken, url, method)).pipe(
      map((result) => {
        console.log('result', result);
        if (result === 200) {
          Logger.log('Auth Success: Token');
          return true;
        } else if (result === 404) {
          Logger.log('Auth Failed: Token Not Found');
          Logger.log('Auth Requested: JWT via Token');
          return super.canActivate(context) as boolean;
        } else {
          Logger.log('Auth Failed: Token Forbidden');
          throw new ForbiddenException();
        }
      }),
      catchError(async (e) => {
        if (e.status === 403) {
          Logger.log('Auth Failed: Token Forbidden (Catch)');
          throw new ForbiddenException();
        }
        Logger.log('Auth Requested: JWT');
        return super.canActivate(context) as Promise<boolean>;
      }),
    );
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
