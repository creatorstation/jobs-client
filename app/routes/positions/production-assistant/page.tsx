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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CreatorStation | Production Assistant" },
    {
      name: "description",
      content:
        "Join CreatorStation as a Production Assistant and contribute to top Turkish YouTube channels!",
    },
  ];
}

type UserData = {
  name: string;
  email: string;
  phone: string;
  cv: FileList;
  europeSide: string;
  semt: string;
  linkedin: string;
};

export default function ProductionAssistant() {
  const [userData, setUserData] = useState<Partial<UserData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isValidPh = isPhoneValid(userData?.phone || "");

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<UserData>({
    mode: "all",
  });

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onSubmit = (data: UserData) => {
    setIsSubmitting(true);
    setUserData(data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone.replace(/\s/g, ""));
    formData.append("europeSide", data.europeSide);
    formData.append("semt", data.semt);
    formData.append("cv", data.cv[0]);
    formData.append("linkedin", data.linkedin);
    formData.append("position", "Production Assistant");

    axios
      .post(
        "https://auto.creatorstation.com/webhook/3e4a79e8-a76b-4458-93a9-7e760f266c07",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      )
      .then(async (response) => {
        console.log(response);
        toast("Application submitted successfully!", { type: "success" });

        await new Promise((resolve) => setTimeout(resolve, 3000));

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
      setValue("name", userData.name as string);
      setValue("email", userData.email as string);
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

          window.location.reload();
        });
    }
  }, []);

  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/production-assistant`
      : "";

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Production Assistant
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-gray-700">
          At CreatorStation, we’re shaping the future of digital content! As a
          trailblazer in influencer marketing and talent management, we partner
          with Turkey’s top creators on YouTube, Instagram, and TikTok across
          entertainment, gaming, education, style, beauty, and travel. With over
          50 million subscribers and 40 million unique viewers monthly, we
          produce dynamic, high-quality content that keeps audiences coming back
          for more. If you’re passionate about YouTube, Instagram, and TikTok,
          have an eye for beauty trends, and love bringing creative ideas to
          life, we’d love to have you on board. Explore our work on Instagram{" "}
          <a className="text-blue-500" href="https://crst.io/ig">
            @creatorstation
          </a>{" "}
          and YouTube{" "}
          <a className="text-blue-500" href="https://crst.io/yt">
            Youtuber Durağı
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Position</h2>
        <p className="text-gray-700">Production Assistant</p>
        <p className="text-gray-700">
          Location: This is a full-time, onsite role based at our Vadistanbul
          office on the European side of Istanbul. Candidates must reside on the
          European side of Istanbul.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Why Join Us?</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Work with top creators and household brands to produce content that
            makes an impact.
          </li>
          <li>
            Immerse yourself in a creative, fast-paced environment where no two
            days are the same.
          </li>
          <li>
            Contribute to projects that push the boundaries of digital
            storytelling across YouTube, Instagram, and TikTok.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What We’re Looking For</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Social Media Enthusiast: You actively follow creators and stay tuned
            to the latest trends on YouTube, Instagram, and TikTok.
          </li>
          <li>
            Beauty & Makeup Pro: You’re familiar with makeup, beauty products,
            and the latest trends in the industry.
          </li>
          <li>
            Reliable & Flexible: Available to work on-site in Istanbul, five
            days a week, with no domestic travel restrictions.
          </li>
          <li>
            Trend Savvy: You keep up with the latest on YouTube, Instagram,
            TikTok, and other social media platforms.
          </li>
          <li>Bilingual Advantage: Strong proficiency in English.</li>
          <li>
            Location-Specific Requirement: Residing on the European side of
            Istanbul is required.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Role</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Plan & Organize: Manage video and social media content preparations,
            track timelines, and ensure seamless execution.
          </li>
          <li>
            Source & Manage Supplies: Handle procurement, returns, and
            organization of materials, including makeup and beauty products.
          </li>
          <li>
            Be the Go-To Person: Support creators and filming crews with
            everything they need to succeed.
          </li>
          <li>
            Ensure Flawless Content: Preview videos, test featured products
            (especially in beauty), and provide actionable feedback.
          </li>
          <li>
            Handle Logistics: Manage permits, expenses, and other organizational
            tasks for shoots across YouTube, Instagram, and TikTok.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What You Bring</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>A love for all things digital, creative, and beautiful.</li>
          <li>
            A proactive, problem-solving attitude and attention to detail.
          </li>
          <li>
            The ability to thrive in a fast-paced, collaborative environment.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Ready to Make Your Mark?
        </h2>
        <p className="text-gray-700">
          Apply now to join CreatorStation’s Istanbul team and be part of
          shaping the next big thing in digital content creation. Let’s create
          something extraordinary together!
        </p>
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

            <div className="mt-4">
              <LinkedInLogin redirPath="production-assistant" />
            </div>
          </>
        ) : (
          <>
            <hr className="my-8" />
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
              <PhoneInput
                className="block w-full p-2 mb-4 border rounded"
                inputStyle={{ border: "none", width: "100%", fontSize: "1rem" }}
                countrySelectorStyleProps={{
                  buttonStyle: {
                    border: "none",
                  },
                }}
                defaultCountry="tr"
                value={userData?.phone || ""}
                onChange={(phone) => {
                  setUserData((prev) => ({ ...prev, phone }));
                  setValue("phone", phone);
                  trigger("phone");
                }}
              />
              {!isValidPh && (
                <p className="text-red-500">
                  Please enter a valid phone number.
                </p>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClick}
                className="mb-4 p-4 border-dashed border-2 border-gray-300 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
              >
                <p>
                  Drag and drop your CV here or click to upload. (PDF or Doc)
                </p>
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

              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
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
              <button
                type="submit"
                className={`p-2 rounded ${
                  isValid && !isSubmitting && isValidPh
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={isSubmitting || !isValid || !isValidPh}
              >
                Apply for Production Assistant
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
