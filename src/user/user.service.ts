import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    console.log('\x1b[33m%s\x1b[0m', '📋 UserService.findAll() called');
    return this.prisma.user.findMany({
      take: 10, // Limit to 10 users for easier demonstration
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
