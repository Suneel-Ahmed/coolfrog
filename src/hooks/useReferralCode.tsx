import { useEffect, useState } from 'react';

const useReferralCode = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('startapp');
  
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  return referralCode;
};

export default useReferralCode;
