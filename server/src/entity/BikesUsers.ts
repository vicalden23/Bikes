import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class BikesUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bikeId: number;

  @Column()
  userId: number;

  @Column()
  date: string;

  @Column({ nullable: true })
  rated: number;
}
