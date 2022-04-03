export interface IForgotPassword {
  email: string;
  token: string;
}

export interface IResetPassword {
  token:string;
  password:string;
  confirmPassword:string;
}
