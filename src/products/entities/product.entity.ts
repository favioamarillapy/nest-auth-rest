import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { ProductImage } from './';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    title: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('text', { unique: true })
    slug: string;

    @Column('float', { default: 0 })
    price: number;

    @Column('float', { default: 0 })
    stock: number;

    @Column('text', { array: true, default: [] })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column('text', { array: true, default: [] })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    @BeforeInsert()
    createSlug() {
        this.slug = this.title
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    updateSlug() {
        this.slug = this.title
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '');
    }
}
