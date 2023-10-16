import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  location: string;

  @Column('integer', { array: true, default: [] })
  ratings: number[];

  @Column({ default: true })
  isAvailable: boolean;
}
