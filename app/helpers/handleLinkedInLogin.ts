import axios from "axios";
import { toast } from "react-toastify";

export function handleLinkedInAuth(redirectUri: string, updateUserData: Function, updateAppData: Function) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
  
    if (code) {
      updateAppData({ oauthLoading: true });

      axios
        .get('https://i4qbeevmo5.execute-api.us-east-1.amazonaws.com/v1/api/auth/linkedin', {
          params: {
            code,
            redirect_uri: redirectUri,
          },
        })
        .then((response) => {
          const { data } = response;
  
          updateUserData({ email: data.email, name: data.name });
          toast('Signed in successfully!', { type: 'success' });
        })
        .catch((error) => {
          window.history.replaceState({}, document.title, window.location.pathname);
  
          window.location.reload();
        }).finally(() => {
          updateAppData({ oauthLoading: false });
        });
    }
  }