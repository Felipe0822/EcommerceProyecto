export interface ICategoryService {

getCategories(): Promise<ICategoryService[]>;

getCategory(id: number): Promise<any>;

createCategory(
    name: string,
    description: string
): Promise<ICategoryService>;

updateCategory(
    id: number,
    name: string,
    description: string
): Promise<ICategoryService>;

deleteCategory(id: number): Promise<ICategoryService>;

}