import { GoogleLogin } from "@react-oauth/google";
import type { Route } from "./+types/page";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import LinkedInLogin from "~/components/LinkedinButton";

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
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone?: string;
    cv?: FileList;
    europeSide?: string;
    semt?: string;
    linkedin?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<{
    name: string;
    email: string;
    phone: string;
    cv: FileList;
    europeSide: string;
    semt: string;
    linkedin: string;
  }>({
    mode: "all",
  });

  const onSubmit = (data: {
    name: string;
    email: string;
    phone: string;
    cv: FileList;
    europeSide: string;
    semt: string;
    linkedin: string;
  }) => {
    setUserData(data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("europeSide", data.europeSide);
    formData.append("semt", data.semt);
    formData.append("cv", data.cv[0]);
    formData.append("linkedin", data.linkedin);
    formData.append("position", "Videographer");

    axios
      .post(
        "https://auto.creatorstation.com/webhook/3e4a79e8-a76b-4458-93a9-7e760f266c07",
        formData
      )
      .then((response) => {
        console.log(response);
        toast("Application submitted successfully!", { type: "success" });
        window.location.href = "https://creatorstation.com/";
      })
      .catch((error) => {
        console.error(error);
        toast("An error occurred while submitting the application.", {
          type: "error",
        });
      });
  };

  useEffect(() => {
    if (userData) {
      setValue("name", userData.name);
      setValue("email", userData.email);
      if (userData.phone) setValue("phone", userData.phone);
      if (userData.europeSide) setValue("europeSide", userData.europeSide);
      if (userData.semt) setValue("semt", userData.semt);
      if (userData.linkedin) setValue("linkedin", userData.linkedin);
    }
  }, [userData, setValue]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          setValue("cv", files as unknown as FileList);
          trigger("cv");
          console.log("Files dropped:", files);
          const reader = new FileReader();
          reader.onload = (e) => {
            setFilePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          toast("Only PDF and DOCX files are supported.", {
            type: "error",
          });
        }
      }
    },
    [setValue, trigger]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // LinkedIn: handle success code from the redirect.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      axios
        .get("http://localhost:3000/api/auth/linkedin", {
          params: {
            code,
            redirect_uri: redirectUri,
          },
        })
        .then((response) => {
          const { data } = response;
          setUserData({
            email: data.email,
            name: data.name,
          });
          toast("Signed in successfully!", { type: "success" });
        })
        .catch((error) => {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
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
          channels. We are currently seeking an Account Manager to join our
          team. For a glimpse into our work, visit our Instagram @creatorstation
          and our YouTube channel: Youtuber Durağı.
        </p>
        <p className="text-gray-700 mt-4">
          We are looking for a talented Videographer, both skilled in shooting
          and editing with particular expertise in 2D compositing and green
          screen technology, to join our team in İstanbul. Check out our
          Instagram @creatorstation and our YouTube channel: Youtuber Durağı to
          see how we work.
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
            {/* --- Google Login --- */}
            <GoogleLogin
              size="large"
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                const decoded = jwtDecode<any>(
                  credentialResponse.credential as string
                );
                setUserData(decoded);
                toast("Signed in successfully!", { type: "success" });
              }}
              onError={() => {
                toast("An error occurred while signing in.", { type: "error" });
              }}
              useOneTap={true}
              text="continue_with"
            />

            {/* --- LinkedIn Login (Custom Component) --- */}
            <div className="mt-4">
              <LinkedInLogin />
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="block w-full p-2 mb-4 border rounded"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className="block w-full p-2 mb-4 border rounded"
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
              })}
              className="block w-full p-2 mb-2 border rounded"
              placeholder="Mobile Phone Number"
            />
            <p className="text-gray-500 text-sm mb-2">Format: +905441112222</p>
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleClick}
              className="mb-4 p-4 border-dashed border-2 border-gray-300 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
            >
              <p>Drag and drop your CV here or click to upload. (PDF or Doc)</p>
              <input
                type="file"
                {...register("cv", { required: "CV is required" })}
                ref={fileInputRef}
                className="hidden"
                accept=".pdf, .docx"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const file = files[0];
                    if (
                      file.type === "application/pdf" ||
                      file.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ) {
                      setValue("cv", files as unknown as FileList);
                      trigger("cv"); // Trigger validation for CV
                      console.log("File selected:", files);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFilePreview(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      toast("Only PDF and DOCX files are supported.", {
                        type: "error",
                      });
                      e.target.value = "";
                    }
                  }
                }}
              />
            </div>
            {errors.cv && (
              <p className="text-red-500">Uploading a CV is required.</p>
            )}

            {filePreview && (
              <div className="mt-2">
                <p>Preview:</p>
                {filePreview.startsWith("data:application/pdf") ? (
                  <iframe
                    src={filePreview}
                    className="w-full h-64 border rounded"
                  />
                ) : (
                  <p>File type not supported for preview.</p>
                )}
              </div>
            )}

            <div className="mb-4 mt-4">
              <label className="block mb-2">
                Are you currently living on the European side of Istanbul?
              </label>
              <select
                {...register("europeSide", { required: "Please select" })}
                className="block w-full p-2 border rounded"
              >
                <option value="">Select</option>
                <option value="evet">Yes</option>
                <option value="hayir">No</option>
              </select>
              {errors.europeSide && (
                <p className="text-red-500">{errors.europeSide.message}</p>
              )}
            </div>

            <input
              type="text"
              {...register("semt", { required: "District is required" })}
              className="block w-full p-2 mb-4 border rounded"
              placeholder="District (Ex: Kadıköy)"
            />
            {errors.semt && (
              <p className="text-red-500">{errors.semt.message}</p>
            )}

            <input
              type="url"
              {...register("linkedin", {
                pattern: {
                  value:
                    /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
                  message: "Invalid LinkedIn URL",
                },
              })}
              className="block w-full p-2 mb-4 border rounded"
              placeholder="LinkedIn Profile URL (Optional)"
            />
            {errors.linkedin && (
              <p className="text-red-500">{errors.linkedin.message}</p>
            )}
            {errors.linkedin && (
              <p className="text-red-500">{errors.linkedin.message}</p>
            )}

            <button
              type="submit"
              className={`p-2 rounded ${
                isValid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!isValid}
            >
              Apply for Videographer
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
