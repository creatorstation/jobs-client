import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import LinkedInLogin from "~/components/LinkedinButton";
import type { Route } from "../social-media-manager/+types/page";
import { userStore } from "~/store/user-store";
import { SubmitForm } from "~/components/SubmitForm";
import axios from "axios";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CreatorStation | Social Media Intern" },
    {
      name: "description",
      content:
        "Join CreatorStation as a Social Media Intern and contribute to top Turkish YouTube channels!",
    },
  ];
}

export default function SocialMediaIntern() {
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
      ? `${window.location.origin}/social-media-intern`
      : "";

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Social Media Intern
      </h1>
      <section className="mb-6">
        <p className="text-gray-700">
          Are you ready to kickstart your career in the exciting world of
          influencer marketing, talent management, and social media production?
          CreatorStation, the leading agency managing Turkey’s top social media
          channels and creating engaging original content across entertainment,
          education, style, beauty, and travel, is looking for passionate
          individuals to join our team!
        </p>
        <p className="text-gray-700 mt-4">
          Why Intern at CreatorStation? At CreatorStation, we believe in
          learning by doing. As an intern, you’ll dive headfirst into the
          dynamic world of social media, gaining hands-on experience and working
          alongside a talented team of professionals. To see what we’re all
          about, check out our Instagram{" "}
          <a className="text-blue-500" href="https://crst.io/ig">
            @creatorstation
          </a>{" "}
          and our YouTube channel,{" "}
          <a className="text-blue-500" href="https://crst.io/yt">
            Youtuber Durağı
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What We’re Looking For</h2>
        <p className="text-gray-700">
          We’re searching for a Social Media Intern who is passionate, creative,
          and excited to grow their skills in a fast-paced environment. If
          you’re a team player with an interest in TikTok, Instagram, and UGC
          (User-Generated Content), this is your chance to shine!
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Key Responsibilities</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Collaborate on the full content creation process: from brainstorming
            and planning to shooting, editing, and posting.
          </li>
          <li>
            Support in managing and scheduling content for our brand and
            business social media accounts (Instagram, TikTok, LinkedIn).
          </li>
          <li>
            Assist in creating engaging photo and video content using
            smartphones or professional cameras.
          </li>
          <li>
            Monitor content performance and contribute to hitting targets for
            posts, views, likes, and follower growth.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Availability to work a minimum of 4 full days per week in our
            Vadistanbul office.
          </li>
          <li>
            A strong interest in social media, content creation, and digital
            marketing.
          </li>
          <li>Familiarity with tools like Canva is a plus.</li>
          <li>Strong communication and teamwork skills.</li>
          <li>Fluent in Turkish with a good understanding of English.</li>
          <li>
            Resides on the European side of Istanbul, preferably near
            Vadistanbul.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What’s in It for You?</h2>
        <p className="text-gray-700">
          This internship is an excellent opportunity to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Gain valuable hands-on experience in social media and content
            creation.
          </li>
          <li>
            Work with some of Turkey’s top influencers and leading brands.
          </li>
          <li>Be part of a dynamic and collaborative team.</li>
        </ul>
      </section>

      <p className="text-gray-700">
        Ready to embark on this exciting journey? Apply now and take the first
        step toward a rewarding career in social media!
      </p>

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
              <LinkedInLogin redirPath="social-media-intern" />
            </div>
          </>
        ) : (
          <>
            <hr className="my-8" />
            <SubmitForm
              submitBtnText="Apply for Social Media Intern"
              positionName="Social Media Intern"
              nonFullTime
            />
          </>
        )}
      </div>
    </main>
  );
}
