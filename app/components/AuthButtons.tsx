import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import LinkedInLogin from "./LinkedinButton";
import { userStore } from "~/store/user-store";

interface AuthButtonsProps {
  redirPath: string;
}

export function AuthButtons({ redirPath }: AuthButtonsProps) {
  const { updateUserData } = userStore();

  return (
    <>
      <div className="mt-4 flex justify-center">
        <div className="w-64">
          <GoogleLogin
            size="large"
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              const decoded = jwtDecode<any>(
                credentialResponse.credential as string
              );
              updateUserData(decoded);
              toast("Signed in successfully!", { type: "success" });
            }}
            onError={() => {
              toast("An error occurred while signing in.", { type: "error" });
            }}
            useOneTap={true}
            text="continue_with"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="w-64">
          <LinkedInLogin redirPath={redirPath} />
        </div>
      </div>
    </>
  );
}
