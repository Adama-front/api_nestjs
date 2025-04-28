export class Category {
  constructor(
    private readonly id: string,
    private name: string,
    private description: string | null,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | null {
    return this.description;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
