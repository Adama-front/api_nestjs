import { UserRole } from '../enums/enum.role';

export class User {
  constructor(
    private readonly id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: UserRole,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}
}
