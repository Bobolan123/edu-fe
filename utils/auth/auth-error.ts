import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidCredentials extends AuthError {
    static type = "Email/Password are invalid"
  }

  export class InvalidActive extends AuthError {
    static type = "Email isn't verified"
  }
  

  