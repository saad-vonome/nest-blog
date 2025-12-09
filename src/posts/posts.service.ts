import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  update(id: string, dto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: dto,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
