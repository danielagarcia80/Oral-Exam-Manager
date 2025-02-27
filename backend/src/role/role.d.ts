export interface RoleBody {
  name: string;
  status: string;
  tags: string[];
  privilegs: {
    name: string;
    actions: string;
  };
}
