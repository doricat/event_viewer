import { makeObservable, observable } from "mobx";
import { VerifiableProperty } from "../../infrastructure/validation";
import { createCompare, createMaxLength, createMinLength, createRequired } from "../../infrastructure/validators";
import { PasswordPatchModel } from "../api/account";

export class NameChangeModel {
    constructor(name: string) {
        this.name = new VerifiableProperty<string>(name, '名称', [createRequired(), createMaxLength(20)]);
        makeObservable(this, { name: observable });
    }

    name: VerifiableProperty<string>;
}

export class PasswordChangeModel {
    constructor() {
        this.currentPassword = new VerifiableProperty<string>('', '当前密码', [
            createRequired(),
            createMaxLength(16)
        ]);
        this.password = new VerifiableProperty<string>('', '新密码', [
            createRequired(),
            createMinLength(6),
            createMaxLength(16)
        ]);
        this.confirmPassword = new VerifiableProperty<string>('', '确认新密码', [
            createCompare(() => ({ name: this.password.displayName, value: this.password.value }))
        ]);

        makeObservable(this, {
            currentPassword: observable,
            password: observable,
            confirmPassword: observable
        });
    }

    currentPassword: VerifiableProperty<string>;
    password: VerifiableProperty<string>;
    confirmPassword: VerifiableProperty<string>;

    toApiModel(): PasswordPatchModel {
        return {
            currentPassword: this.currentPassword.value,
            password: this.password.value,
            confirmPassword: this.confirmPassword.value
        };
    }
}
