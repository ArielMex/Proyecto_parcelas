import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: CreateUserDto) {
        return this.prisma.user.create({ data });
    }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async updateUser(id: number, data: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return this.prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return this.prisma.user.delete({ where: { id } });
    }
}