// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
// // import { UserEntity } from './user.entity';
// import { PostEntity } from '../post-entity/post.entity';

// @Entity('comments')
// export class CommentEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => UserEntity, (user) => user.comments)
//   user: UserEntity;

//   @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
//   post: PostEntity;

//   @Column({ type: 'text' })
//   content: string;

//   @Column({ type: 'boolean', default: false })
//   is_deleted: boolean;

//   @CreateDateColumn({ type: 'timestamp' })
//   created_at: Date;
// } 