import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('users')
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;
    
    @Column()
    password: string;
    
    @Column()
    created_at: number;
}