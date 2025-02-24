/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { RoleService } from 'src/role/role.service';
import { actions } from './privilege.dto';
import { Privilege, RoleStatus, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Uuid } from 'src/utils/uuid';

@Injectable()
export class PrivilegeService {
  constructor(
    private roleService: RoleService,
    private prisma: PrismaService,
  ) {}

  async create(
    action: string,
    resource: string,
    status: string,
    roleUuid: string,
  ) {
    const newPrivilege: Privilege = {
      uuid: new Uuid().generateUUID(),
      date_created: new Date(),
      date_modified: new Date(),
      action: action,
      resource: resource,
      status: RoleStatus[status],
      role_uuid: roleUuid,
    };

    return await this.prisma.privilege.create({ data: newPrivilege });
  }

  async findWithRole(role: Role): Promise<Privilege> {
    return await this.prisma.privilege.findFirst({
      where: { role_uuid: role.uuid },
    });
  }

  async findOne(uuid: string): Promise<Privilege> {
    return await this.prisma.privilege.findFirst({ where: { uuid } });
  }

  /*
   * This function verifies the privilege of a user
   * @param role: Roles
   * @param request: string
   * @param entity: string
   * @param field: string
   * @returns boolean
   * */
  async verifyPrivilege(
    role: Role,
    request: string,
    entity: string,
  ): Promise<boolean> {
    const loadPrivielge = await this.findWithRole(role);
    if (loadPrivielge) {
      if (loadPrivielge.action[actions.indexOf(request)] === '1') {
        if (
          loadPrivielge.resource.split(',').indexOf(entity) >= 0 ||
          loadPrivielge.resource === 'x'
        ) {
          //   if (
          //     loadPrivielge.field
          //       ?.split(',')
          //       [
          //         loadPrivielge.permission?.split(',')?.indexOf(entity)
          //       ]?.split('#')
          //       .indexOf(field) >= 0 ||
          //     loadPrivielge.field
          //       ?.split(',')
          //       [
          //         loadPrivielge.permission?.split(',')?.indexOf(entity)
          //       ]?.split('#')[1] === 'x' ||
          //     loadPrivielge.field === 'x' ||
          //     loadPrivielge.field.split(',')[
          //       loadPrivielge.permission?.split(',').indexOf(entity)
          //     ] === 'x'
          //   ) {
          //     if (loadPrivielge.validation === RoleStatus.ACTIVE) {
          //       return true;
          //     }
          //   }
          // }
          Logger.log('Not Enough Privilege');
          return false;
        }
      }
      Logger.log('Not Enough Privilege');
      return false;
    }
  }
}
