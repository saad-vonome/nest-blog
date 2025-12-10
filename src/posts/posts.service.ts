import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  create(userId: string, dto: CreatePostDto) {
    const post = this.postsRepository.create({
      ...dto,
      authorId: userId,
    });
    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find({
      relations: ['author', 'category'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.postsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.postsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
