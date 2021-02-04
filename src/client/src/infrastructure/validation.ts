import { action, makeObservable, observable } from "mobx";

export type Validator = (value: any, displayName: string) => string | undefined;
export type VerifiableType = string | number | Date | undefined;

export class VerifiableProperty<T extends VerifiableType> {
    constructor(value: T, displayName: string, validators: Validator[]) {
        this.value = value;
        this.displayName = displayName;
        this.validators = validators;

        makeObservable(this, {
            value: observable,
            validationResult: observable,
            validate: action
        });
    }

    value: T;
    displayName: string;
    validators: Validator[];
    validationResult: string[] = [];

    validate(): void {
        this.validationResult.splice(0);
        this.validators.forEach(x => {
            const message = x(this.value, this.displayName);
            if (message !== undefined) {
                this.validationResult.push(message);
            }
        })
    }

    public get Invalid(): boolean {
        return this.validationResult.length > 0;
    }

    public get firstError(): string | undefined {
        return this.Invalid ? this.validationResult[0] : undefined;
    }
}
