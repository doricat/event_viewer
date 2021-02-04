import { AccountGetModel } from "../api/account";

export class Account {
    id!: number;
    name!: string;
    email!: string;
    avatar!: string;

    public static fromApiModel(model: AccountGetModel): Account {
        const account = new Account();
        account.id = model.id;
        account.name = model.name;
        account.email = model.email;
        account.avatar = model.avatar;
        return account;
    }
}
