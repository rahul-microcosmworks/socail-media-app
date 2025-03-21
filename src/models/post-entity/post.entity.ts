import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../user-entity/user.entity';
import { PostMediaEntity } from './postMedia.entity';
import { ReactionEntity } from './reaction.entity';
// import { CommentEntity } from '../user-entity/comment.entity';
// import { ReactionEntity } from '../user-entity/reaction.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ type: 'varchar', nullable: true })
  content: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => PostMediaEntity, (postMedia) => postMedia.post)
  media: PostMediaEntity[];
  
  @OneToMany(() => ReactionEntity, (reaction) => reaction.post, { cascade: true })
  reactions: ReactionEntity[];
  
  // @OneToMany(() => CommentEntity, (comment) => comment.post)
  // comments: CommentEntity[];

}
