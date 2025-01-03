import { GoogleLogin } from "@react-oauth/google";
import type { Route } from "./+types/page";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import LinkedInLogin from "~/components/LinkedinButton";
import { PhoneInput } from "react-international-phone";
import { isPhoneValid } from "~/helpers/isPhoneValid";
import { SubmitForm } from "~/components/SubmitForm";
import { userStore } from "~/store/user-store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CreatorStation | Videographer" },
    {
      name: "description",
      content:
        "Join CreatorStation as a Videographer and contribute to top Turkish YouTube channels!",
    },
  ];
}

export default function Videographer() {
  const { userData, updateUserData } = userStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      axios
        .get(
          "https://i4qbeevmo5.execute-api.us-east-1.amazonaws.com/v1/api/auth/linkedin",
          {
            params: {
              code,
              redirect_uri: redirectUri,
            },
          }
        )
        .then((response) => {
          const { data } = response;

          updateUserData({ email: data.email, name: data.name });
          toast("Signed in successfully!", { type: "success" });
        })
        .catch((error) => {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          window.location.reload();
        });
    }
  }, []);

  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/videographer`
      : "";

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Videographer</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-gray-700">
          CreatorStation is a leading company in influencer marketing and talent
          management, specializing in managing top Turkish YouTube channels
          across various categories such as entertainment, gaming, education,
          style, beauty, and travel. We produce top-notch content for these
          channels.
        </p>
        <p className="text-gray-700 mt-4">
          We are looking for a talented Videographer, both skilled in shooting
          and editing with particular expertise in 2D compositing and green
          screen technology, to join our team in İstanbul. Check out our
          Instagram{" "}
          <a className="text-blue-500" href="https://crst.io/ig">
            @creatorstation
          </a>{" "}
          and our YouTube channel:{" "}
          <a className="text-blue-500" href="https://crst.io/yt">
            Youtuber Durağı
          </a>{" "}
          to see how we work.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Bachelor’s or Master’s degree in related fields</li>
          <li>
            At least 2 years of experience as a videographer, video editor, or
            VFX Artist
          </li>
          <li>
            This is a full-time and on-site job. We are located in Vadistanbul.
          </li>
          <li>
            Apply 2D compositing and green screen techniques to create
            compelling visual effects.
          </li>
          <li>
            Proficiency in TikTok/Reels vertical video grammar and trend
            monitoring.
          </li>
          <li>Knowledge of AI trends and applications in video production.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Responsibilities</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Work with YouTubers and Brands to identify and pitch unique,
            engaging video content.
          </li>
          <li>
            Shoot (With Canon R & Cinema Series), edit, and produce online video
            content, ranging from big productions to quick turnarounds.
          </li>
          <li>
            Work with creators to define and shape video programming strategy
            and content for the related verticals.
          </li>
          <li>Manage multiple shoots and edits simultaneously.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Qualifications</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Minimum 2 years of DSLR video shooting experience (preferably with
            Canon Cameras).
          </li>
          <li>
            Minimum 2 years of editing with Adobe Premiere experience is a must.
          </li>
          <li>
            Minimum 1 year of 2D compositing and green screen techniques
            experience is a must.
          </li>
          <li>Experience with gimbals is a plus.</li>
          <li>
            Ability to thrive in a fast-paced, deadline-driven environment.
          </li>
          <li>Passion and knowledge of online video.</li>
          <li>Creative, flexible thinker.</li>
          <li>Native level of Turkish.</li>
          <li>Medium level of English.</li>
        </ul>
      </section>

      <div className="text-center">
        {!userData ? (
          <>
            <div className="mb-4">
              <strong>To apply, please sign in below:</strong>
            </div>
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

            <div className="mt-4">
              <LinkedInLogin redirPath="videographer" />
            </div>
          </>
        ) : (
          <>
            <hr className="my-8" />
            <SubmitForm
              positionName="Videographer"
              submitBtnText="Apply for Videographer"
            />
          </>
        )}
      </div>
    </main>
  );
}
