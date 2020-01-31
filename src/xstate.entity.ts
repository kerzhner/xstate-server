import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class XState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("jsonb")
  state: string;
}
