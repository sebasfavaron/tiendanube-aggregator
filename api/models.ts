import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ type: 'real', nullable: false })
  price!: number;

  @Column({ type: 'text', nullable: false })
  image!: string;

  @Column({ type: 'text', nullable: false })
  url!: string;
}
