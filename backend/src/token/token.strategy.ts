/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrivilegeService } from 'src/privilege/privilege.service';
import { DecodedJwtDto } from './token.dto';
import { RoleService } from 'src/role/role.service';
import { TokenService } from './token.service';
import { UserService } from 'src/user/user.service';
import { RoleStatus } from '@prisma/client';

@Injectable()
export class TokenStrategy {
  constructor(
    private readonly privilegeService: PrivilegeService,
    private readonly roleService: RoleService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  /*
   * This function verifies the token and checks if the user has the necessary privileges to access
   * the endpoint
   * @param token: string
   * @param url: string
   * @param method: string
   * @returns number
   * 200: Success
   * 403: Forbidden
   * 404: Not Found
   * */
  async verifyToken(
    token: string,
    url: string,
    method: string,
  ): Promise<number> {
    const entity = url.split('/')[1] ? url.split('/')[1] : '';
    const tokenRow = await this.tokenService.findOne(token);
    let role = null;
    if (tokenRow) {
      if (tokenRow.role_uuid) {
        role = await this.roleService.findOne(tokenRow.role_uuid);
      } else if (tokenRow.user_id) {
        const roleToSend = await this.userService.findOne(tokenRow.user_id);
        if (roleToSend) {
          role = await this.roleService.findOne(roleToSend.id);
        }
      }

      if (role) {
        const privilegeStatus = await this.privilegeService.verifyPrivilege(
          role,
          method,
          entity,
        );
        console.log(
          `privilegeStatus: ${privilegeStatus} & roleStatus: ${role.status}`,
        );
        if (privilegeStatus && role.status === RoleStatus.ACTIVE) {
          return 200;
        } else {
          return 403;
        }
      }
    } else {
      try {
        const decode = jwt.verify(
          token,
          process.env.JWT_SECRET,
        ) as DecodedJwtDto;
        if (decode.roleId) {
          const role = await this.roleService.findOne(decode.roleId);
          if (role) {
            const privilegeStatus = await this.privilegeService.verifyPrivilege(
              role,
              method,
              entity,
            );
            if (privilegeStatus) {
              return 404;
            } else {
              return 403;
            }
          }
        }
      } catch (error) {
        Logger.error(error);
      }
    }
    return 403;
  }
}
