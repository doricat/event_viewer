import { makeObservable, observable } from "mobx";
import { VerifiableProperty } from "../../infrastructure/validation";
import { createMaxLength, createRequired } from "../../infrastructure/validators";

export class NameChangeModel {
    constructor(name: string) {
        this.name = new VerifiableProperty<string>(name, '名称', [createRequired(), createMaxLength(20)]);
        makeObservable(this, { name: observable });
    }

    name: VerifiableProperty<string>;
}
