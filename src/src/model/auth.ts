export interface AuthProps {
    onSubmit: (data: AuthFormData) => void;
}

export interface AuthFormData {
    email: string;
    password: string;
    name?: string;
    confirmPassword?: string;
}
