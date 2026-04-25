export interface IAuthService {
  register(data: any): Promise<any>;
  login(email: string, password: string): Promise<any>;
  getUsers(): Promise<any[]>;
  getUserById(id: number): Promise<any>;
  updateUser(id: number, data: any): Promise<any>;
  deleteUser(id: number): Promise<any>;
}