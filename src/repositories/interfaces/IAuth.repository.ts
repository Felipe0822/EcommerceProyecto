export interface IAuthRepository {
  findUserByEmail(email: string): Promise<any | null>;
  createUser(user: any): Promise<any>;
    findUserById(id: number): Promise<any | null>;
    findAllUsers(): Promise<any[]>;
    updateUser(id: number, user: any): Promise<any>;
    deleteUser(id: number): Promise<any>;
    
}