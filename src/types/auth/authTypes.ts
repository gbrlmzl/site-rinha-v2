export type RegisterState = {
  success: boolean | null;
  message: string;
  secondaryMessage?: string;
  thirdMessage?: string;
};

export type PasswordRecoveryState = {
  submitted: boolean;
  message: string;
};
