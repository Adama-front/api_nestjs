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

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): string {
    return this.role;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
