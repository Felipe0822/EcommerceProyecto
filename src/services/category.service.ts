import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";
import { ICategoryService } from "./interfaces/ICategoryService";

export class CategoryService implements ICategoryService {

constructor(
    private readonly categoryRepository: ICategoryRepository
    ){ }

async getCategories() {
    return this.categoryRepository.findAll();
}

async getCategory(id: number) {

    const category = await this.categoryRepository.findById(id);

    if (!category) {
        throw new Error("Categoría no encontrada");
    }

    return category;
}

async createCategory(name: string, description: string) {
    
    if (!name) {
    throw new Error("El nombre es obligatorio");
    }

    return this.categoryRepository.create(name, description);
}

async updateCategory(id: number, name: string, description: string) {

    const category = await this.categoryRepository.update(id, name, description);

    if (!category) {
    throw new Error("Categoría no encontrada");
    }

    return category;
}

async deleteCategory(id: number) {

    const category = await this.categoryRepository.delete(id);

    if (!category) {
        throw new Error("Categoría no encontrada");
    }

    return category;
}
}