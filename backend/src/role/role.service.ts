/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Role, RoleStatus, RoleType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Uuid } from 'src/utils/uuid';
@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findOne(uuid?: string): Promise<Role> {
    const role = await this.prisma.role.findUniqueOrThrow({ where: { uuid } });
    if (role) {
      return role;
    }
    return null;
  }

  async create(name: RoleType, status: string, tags: string[]): Promise<Role> {
    const newRole: Role = {
      uuid: new Uuid().generateUUID(),
      name: RoleType[name],
      status: RoleStatus[status],
      date_created: new Date(),
      date_modified: new Date(),
      tags: tags.toString(),
    };
    return await this.prisma.role.create({ data: newRole });
  }

  async update(
    uuid: string,
    name?: RoleType,
    status?: string,
    token?: string,
    tags?: string[],
  ) {
    const role: Role = await this.findOne(uuid);
    if (role) {
      return await this.prisma.role.update({
        where: { uuid: role.uuid },
        data: {
          name: RoleType[name] || role.name,
          status: RoleStatus[status || role.status],
          date_modified: new Date(),
          tags: tags.toString() || role.tags,
        },
      });
    }
  }

  async findWithName(name: RoleType): Promise<Role> {
    return await this.prisma.role.findFirst({ where: { name } });
  }
}
