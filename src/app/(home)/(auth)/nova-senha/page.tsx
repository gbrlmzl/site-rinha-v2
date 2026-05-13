import { Suspense } from 'react';
import NewPasswordForm from './NewPasswordForm';

export default function NewPasswordPage() {
  return (
    <Suspense fallback={null}>
      <NewPasswordForm />
    </Suspense>
  );
}
