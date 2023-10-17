import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  token: string;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  password: string;
}
