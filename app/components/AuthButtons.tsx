import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { userStore } from '~/store/user-store';
import axios from 'axios';
import { useState } from 'react'; // Import useState
import { appStore } from '~/store/app-store';

interface AuthButtonsProps {
  redirPath: string;
}

export function AuthButtons({ redirPath }: AuthButtonsProps) {
  const { appData, updateAppData } = appStore();

  const redirectToLinkedIn = () => {
    updateAppData({ oauthLoading: true });
    const clientId = '77bdm9yb1yeig5';
    const redirectUri = encodeURIComponent(`${window.location.origin}/${redirPath}`);
    const state = Math.random().toString(36).substring(2);
    const scope = 'email openid profile ';

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    window.location.href = linkedInAuthUrl;
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      updateAppData({ oauthLoading: true });
      axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          params: {
            access_token: tokenResponse.access_token,
          },
        })
        .then((response) => {
          updateUserData({
            email: response.data.email,
            name: response.data.name,
          });
          toast('Signed in successfully!', { type: 'success' });
        })
        .finally(() => {
          updateAppData({ oauthLoading: false });
        });
    },
    onError: (error) => {
      console.log(error);
      toast('An error occurred while signing in.', { type: 'error' });
      updateAppData({ oauthLoading: false });
    },
    flow: 'implicit',
  });

  const { updateUserData } = userStore();

  return (
    <>
      <div className="mt-4 flex justify-center">
        <div className="w-64">
          <button
            onClick={() => login()}
            disabled={appData.oauthLoading} // Disable button if loading
            className="w-64 px-2 py-2 border flex gap-2 border-slate-200 rounded text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 disabled:opacity-50"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/452216/google.svg"
              loading="lazy"
              alt="google logo"
            />
            <span className="pt-0.5 text-sm w-full">{appData.oauthLoading ? 'Loading...' : 'Apply with Google'}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="w-64">
          <button
            onClick={redirectToLinkedIn}
            disabled={appData.oauthLoading} // Disable button if loading
            className="w-64 px-2 py-2 border flex gap-2 border-slate-200 rounded text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 disabled:opacity-50"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475661/linkedin-color.svg"
              loading="lazy"
              alt="linkedin logo"
            />
            <span className="pt-0.5 text-sm w-full">{appData.oauthLoading ? 'Loading...' : 'Apply with LinkedIn'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
