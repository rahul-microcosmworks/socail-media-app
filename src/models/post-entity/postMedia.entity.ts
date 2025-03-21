import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('post_media')
export class PostMediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  media_url: string;

  @Column({ type: 'varchar', nullable: false })
  media_type: string;

  @ManyToOne(() => PostEntity, (post) => post.media, { onDelete: 'CASCADE' })
  post: PostEntity;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}