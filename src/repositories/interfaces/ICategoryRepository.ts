export interface ICategoryRepository {
findAll(): Promise<any[]>;

findById(id: number): Promise<any | null>;

create(name: string, description: string): Promise<any>;

update(
    id: number,
    name: string,
    description: string
): Promise<any | null>;

delete(id: number): Promise<any | null>;

}