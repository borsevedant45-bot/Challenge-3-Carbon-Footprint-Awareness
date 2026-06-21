declare module 'shadcn/ui' {
  import React from 'react';

  const Button: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
  const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>>;
  const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>>;
  const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>>;
  const ErrorMessage: React.FC<{ children?: React.ReactNode }>;

  export default {
    Button,
    Input,
    Form,
    Label,
    ErrorMessage,
  };
}