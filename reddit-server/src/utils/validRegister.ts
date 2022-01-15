import { UsernamePasswordInput } from "./UsernamePasswordInput";

export const validRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return {
      field: 'email',
      message: "invalid email"
    };
  }

  if (options.username.length <= 2) {
    return {
      field: 'username',
      message: "username length should be greater than 2"
    };
  }

  if (options.username.includes("@")) {
    return {
      field: 'username',
      message: "username contains @"
    };
  }

  if (options.password.length <= 2) {
    return {
      field: 'password',
      message: "password length should be greater than 2"
    };
  }

  return null;
};
