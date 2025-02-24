export interface DecodedJwtDto {
  readonly user_id: string;
  readonly roleId: string;
  iat: number;
  exp: number;
}

export class TokenDto {
  asignedTo: string;
}
