import { UserGetModel } from "../api/user";

export class User {
    id!: number;
    name!: string;
    email!: string;
    avatar!: string;

    public static fromApiModel(model: UserGetModel): User {
        const o = new User();
        o.id = model.id;
        o.name = model.name;
        o.email = model.email;
        o.avatar = model.avatar;
        return o;
    }
}
