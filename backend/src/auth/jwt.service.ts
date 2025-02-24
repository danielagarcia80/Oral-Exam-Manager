import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MyJwtService {
  constructor(private readonly jwtService: JwtService) {}
  generateToken(payload: Record<string, any>) {
    const secret =
      process.env.JWT_SECRET ||
      'j18lBOrGklTDbCX1UwxAtrRynX9XBTVSNy5jZUZEoyz1RJhw1H7WtlWfe0jjShE6';
    return this.jwtService.sign(payload, { secret });
  }
}
