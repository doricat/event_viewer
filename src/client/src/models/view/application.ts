import { action, makeObservable, observable, runInAction } from 'mobx';
import { VerifiableProperty } from "../../infrastructure/validation";
import { createMaxLength, createRegularExpression, createRequired, createMinLength } from '../../infrastructure/validators';
import { ApplicationEditionModel } from "../api/application";
import { ApiError } from '../apiResult';

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
            setApiValidationResult: action,
            validate: action
        });
    }

    name: VerifiableProperty<string>;
    applicationId: VerifiableProperty<string>;
    description: VerifiableProperty<string | undefined>;
    enabled: boolean;

    setApiValidationResult(apiError: ApiError): void {
        if (apiError.details === undefined) {
            return;
        }

        for (const error of apiError.details) {
            if (error.target && error.target === 'name') {
                this.name.validationResult.push(error.message);
            } else if (error.target && error.target === 'applicationId') {
                this.applicationId.validationResult.push(error.message);
            } else if (error.target && error.target === 'description') {
                this.description.validationResult.push(error.message);
            }
        }
    }

    validate(): boolean {
        runInAction(() => {
            this.name.validate();
            this.applicationId.validate();
            this.description.validate();
        });

        return !(this.name.invalid
            || this.applicationId.invalid
            || this.description.invalid);
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
