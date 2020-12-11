import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn('increment')
  postId: number;

  @Column({
    default: 'https://gutta.lv/wp-content/uploads/2015/10/test-img.jpg',
    type: 'text',
  })
  img: string;

  @Column({ length: 500 })
  title: string;

  @Column('text')
  author: string;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  isAccepted: boolean;
}
