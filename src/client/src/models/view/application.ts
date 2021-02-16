import { action, makeObservable, observable } from 'mobx';
import { VerifiableProperty } from "../../infrastructure/validation";
import { createMaxLength, createRegularExpression, createRequired, createMinLength } from '../../infrastructure/validators';
import { ApplicationEditionModel } from "../api/application";

export class EditionModel {
    constructor(application?: ApplicationEditionModel) {
        let name: string | undefined = '';
        let applicationId: string | undefined = '';
        let description: string | undefined;
        let enabled = true;

        if (application !== undefined) {
            name = application.name;
            applicationId = application.applicationId;
            description = application.description;
            enabled = application.enabled;
        }

        this.name = new VerifiableProperty<string>(name, '应用程序名称', [createRequired(), createMaxLength(20)]);
        this.applicationId = new VerifiableProperty<string>(applicationId, '应用程序Id',
            [
                createRequired(),
                createMinLength(6),
                createMaxLength(30),
                createRegularExpression('^[a-zA-Z\\d_]+$')
            ]);
        this.description = new VerifiableProperty<string | undefined>(description, '描述', [createMaxLength(250)]);
        this.enabled = enabled;

        makeObservable(this, {
            name: observable,
            applicationId: observable,
            description: observable,
            enabled: observable,
            setApiValidationResult: action
        });
    }

    name: VerifiableProperty<string>;
    applicationId: VerifiableProperty<string>;
    description: VerifiableProperty<string | undefined>;
    enabled: boolean;

    setApiValidationResult(): void {

    }

    toApiModel(): ApplicationEditionModel {
        return {
            name: this.name.value,
            applicationId: this.applicationId.value,
            description: this.description.value,
            enabled: this.enabled
        };
    }
}
