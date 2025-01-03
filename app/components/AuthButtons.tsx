import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { userStore } from "~/store/user-store";
import axios from "axios";

interface AuthButtonsProps {
  redirPath: string;
}

export function AuthButtons({ redirPath }: AuthButtonsProps) {
  const redirectToLinkedIn = () => {
    const clientId = "77bdm9yb1yeig5";
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/${redirPath}`
    );
    const state = Math.random().toString(36).substring(2);
    const scope = "email openid profile ";

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    window.location.href = linkedInAuthUrl;
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          params: {
            access_token: tokenResponse.access_token,
          },
        })
        .then((response) => {
          updateUserData({
            email: response.data.email,
            name: response.data.name,
          });
          toast("Signed in successfully!", { type: "success" });
        });
    },
    onError: (error) => {
      console.log(error);
      toast("An error occurred while signing in.", { type: "error" });
    },
    flow: "implicit",
  });

  const { updateUserData } = userStore();

  return (
    <>
      <div className="mt-4 flex justify-center">
        <div className="w-64">
          <button
            onClick={() => login()}
            className="w-64 px-2 py-2 border flex gap-2 border-slate-200 rounded text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/452216/google.svg"
              loading="lazy"
              alt="linkedin logo"
            />
            <span className="pt-0.5 text-sm pl-5">Continue with Google</span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="w-64">
          <button
            onClick={redirectToLinkedIn}
            className="w-64 px-2 py-2 border flex gap-2 border-slate-200 rounded text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475661/linkedin-color.svg"
              loading="lazy"
              alt="linkedin logo"
            />
            <span className="pt-0.5 text-sm pl-5">Continue with Linkedin</span>
          </button>
        </div>
      </div>
    </>
  );
}
