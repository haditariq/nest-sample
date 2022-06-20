import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted', this.email);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Inserted', this.email);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed', this.email);
  }
}
