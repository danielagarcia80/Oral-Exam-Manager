export class UserResponseDto {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  otter_id?: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
  account_creation_date: Date;
}
