import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../user-entity/user.entity';
import { PostEntity } from '../post-entity/post.entity';

@Entity('reactions')
export class ReactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.reactions)
  user: UserEntity;

  // @Column()
  // postId: number;

  @ManyToOne(() => PostEntity, (post) => post.reactions, { onDelete: 'CASCADE' })
  post: PostEntity;

  @Column({ type: 'varchar' })
  type: string; // e.g., 'like', 'love', 'laugh', etc.

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}