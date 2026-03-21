import { error } from "node:console";
import { pool } from "../config/db";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {

async findAll() {
    const result = await pool.query("SELECT * FROM categories");
    return result.rows;
}

async findById(id: number) {
    const result = await pool.query(
      "SELECT * FROM categories WHERE id=$1",
    [id]
    );

    return result.rows[0];
}

async create(name: string, description: string) {
    const result = await pool.query(
      "INSERT INTO categories(name, description) VALUES($1,$2) RETURNING *",
    [name, description]
    );
    
    return result.rows[0];
}

async update(id:number,name:string,description:string){
    const result = await pool.query(
    `UPDATE categories 
    SET name=$1, description=$2 
    WHERE id=$3
    RETURNING *`,
    [name, description, id]
    );
    
    return result.rows[0];  
}

async delete(id: number) {

    const result = await pool.query(
      "DELETE FROM categories WHERE id=$1 RETURNING *",
    [id]
    );

    return result.rows[0];
}


}