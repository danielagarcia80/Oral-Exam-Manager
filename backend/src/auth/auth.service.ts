import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret:
          process.env.JWT_SECRET ||
          ' j18lBOrGklTDbCX1UwxAtrRynX9XBTVSNy5jZUZEoyz1RJhw1H7WtlWfe0jjShE6',
      });
    } catch {
      throw new Error('Invalid token');
    }
  }
}
