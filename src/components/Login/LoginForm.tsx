'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import OAuthButtons from './OAuthButtons';

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // 컴포넌트 마운트 시 자동 로그인 여부를 localStorage에서 가져오기
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(savedRememberMe);
  }, []);

  const handleLogin = async (provider: 'google' | 'kakao') => {
    setLoading(true);
    setError(null);

    // 자동 로그인 여부 저장
    localStorage.setItem('rememberMe', String(rememberMe));

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process?.env?.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.error(`${provider} 로그인 오류:`, error);
      setError(`Failed to log in with ${provider}. ${error.message}`);
      setLoading(false);
      return;
    }

    if (data) {
      router.push('/');
    } else {
      console.error('Login data is empty.');
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center s:w-[320px] s:h-[420] w-[360px] h-[480px] bg-background rounded-[20px] p-4 select-none">
      {/* 로그인 타이틀 */}
      <div className="w-full pb-4 text-center text-white text-4xl font-medium leading-9">@모여라_여기</div>
      <div className="w-full pb-8 text-center text-[#9A9A9A] text-l font-normal leading-relaxed">
        1분만에 SNS로 가입하고 <br /> 나에게 꼭 맞는 동료들을 만나보세요!
      </div>

      {/* 로그인 오류 메시지 */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* 로그인 버튼 */}
      {loading ? (
        <div className="text-center">
          <span className="text-[#212121]">로그인 중...</span>
        </div>
      ) : (
        <OAuthButtons handleLogin={handleLogin} />
      )}

      {/* 자동 로그인 토글 스위치 */}
      <div className="flex items-center space-x-2">
        <label htmlFor="rememberMe" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
            className="sr-only peer"
          />
          <div
            className="w-10 h-5 bg-red-300 peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer 
                      peer-checked:bg-green-500 peer-checked:after:translate-x-5 
                      after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white 
                      after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
          ></div>
        </label>
        <span className="text-[#999999] text-sm select-none">자동 로그인</span>
      </div>

      {/* 개인정보 처리 안내 */}
      <div className="w-80 text-center text-[#999999] text-xs font-medium leading-tight my-5">
        로그인은 개인 정보 보호 정책 및 서비스 약관에 동의하는 것을 의미하며, 서비스 이용을 위해 이메일과 이름, 프로필
        이미지를 수집합니다.
      </div>
    </div>
  );
};

export default LoginForm;
