export class PrivilegeDto {
  readonly roleUuid: string;
  readonly action: string;
  readonly permissions: string;
  readonly fields: string;
}

export const actions = ['POST', 'GET', 'PATCH', 'DELETE'];
