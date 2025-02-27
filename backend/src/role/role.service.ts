/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Role, RoleStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Uuid } from 'src/utils/uuid';
import { RoleBody } from './role';
import { PrivilegeService } from 'src/privilege/privilege.service';
@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => PrivilegeService))
    private privilegeService: PrivilegeService,
  ) {}

  async findOne(uuid?: string): Promise<Role> {
    const role = await this.prisma.role.findUniqueOrThrow({ where: { uuid } });
    if (role) {
      return role;
    }
    return null;
  }

  async findAll(): Promise<Role[]> {
    return await this.prisma.role.findMany();
  }

  async create(dto: RoleBody): Promise<Role> {
    const newRole = await this.prisma.role.create({
      data: {
        uuid: new Uuid().generateUUID(),
        name: dto.name.toUpperCase(),
        status: RoleStatus[dto.status],
        date_created: new Date(),
        date_modified: new Date(),
        tags: dto.tags.toString(),
      },
    });

    if (newRole) {
      const privilege = await this.privilegeService.create(
        dto.privilegs.actions,
        dto.privilegs.name,
        'ACTIVE',
        newRole.uuid,
      );
      if (privilege) {
        return newRole;
      }
      return null;
    }
  }

  async update(
    uuid: string,
    name?: string,
    status?: string,
    token?: string,
    tags?: string[],
  ) {
    const role: Role = await this.findOne(uuid);
    if (role) {
      return await this.prisma.role.update({
        where: { uuid: role.uuid },
        data: {
          name: name || role.name,
          status: RoleStatus[status || role.status],
          date_modified: new Date(),
          tags: tags.toString() || role.tags,
        },
      });
    }
  }

  async findWithName(name: string): Promise<Role> {
    return await this.prisma.role.findFirst({ where: { name } });
  }
}
