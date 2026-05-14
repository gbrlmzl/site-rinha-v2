import { Suspense } from 'react';
import ActivateAccount from './ActivateAccount';

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={null}>
      <ActivateAccount />
    </Suspense>
  );
}
