export interface AccountGetModel {
    id: number;
    name: string;
    email: string;
    avatar: string;
}

export interface AccountPasswordPatchModel {
    currentPassword: string;
    password: string;
    confirmPassword: string;
}
