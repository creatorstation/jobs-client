import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import LinkedInLogin from "~/components/LinkedinButton";
import type { Route } from "../social-media-manager/+types/page";
import { PhoneInput } from "react-international-phone";
import { isPhoneValid } from "~/helpers/isPhoneValid";

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

type UserData = {
  name: string;
  email: string;
  phone: string;
  cv: FileList;
  europeSide: string;
  semt: string;
  linkedin: string;
  mandatoryInternship: boolean;
  hasInsurance: boolean;
  workDays: string[];
};

export default function SocialMediaIntern() {
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
    setIsSubmitting(true); // Disable the button

    const dayMapping: Record<string, string> = {
      Monday: "Pazartesi",
      Tuesday: "Salı",
      Wednesday: "Çarşamba",
      Thursday: "Perşembe",
      Friday: "Cuma",
    };

    const translatedWorkDays = data.workDays.map((day) => dayMapping[day]);

    setUserData(data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone.replace(/\s/g, ""));
    formData.append("europeSide", data.europeSide);
    formData.append("semt", data.semt);
    formData.append("cv", data.cv[0]);
    formData.append("linkedin", data.linkedin);
    formData.append("mandatoryInternship", data.mandatoryInternship.toString());
    formData.append("hasInsurance", data.hasInsurance.toString());
    formData.append("workDays", translatedWorkDays.join(","));
    formData.append("position", "Social Media Intern");

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
        setIsSubmitting(false); // Re-enable the button if there's an error
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
              <LinkedInLogin redirPath="social-media-intern" />
            </div>
          </>
        ) : (
          <>
            <hr className="my-8" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="block w-full p-2 mb-8 border rounded"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-red-500 mb-8">{errors.name.message}</p>
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
                className="block w-full p-2 mb-8 border rounded"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 mb-8">{errors.email.message}</p>
              )}

              <PhoneInput
                className="w-full p-2 mb-4 border rounded"
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
                className="mb-8 p-4 border-dashed border-2 border-gray-300 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
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
                <p className="text-red-500 mb-8">Uploading a CV is required.</p>
              )}

              {filePreview && (
                <div className="mt-2 mb-8">
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
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <div className="mb-8 mt-4">
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
                  <p className="text-red-500 mb-8">
                    {errors.europeSide.message}
                  </p>
                )}
              </div>

              <input
                type="text"
                {...register("semt", { required: "District is required" })}
                className="block w-full p-2 mb-8 border rounded"
                placeholder="District (Ex: Kadıköy)"
              />
              {errors.semt && (
                <p className="text-red-500 mb-8">{errors.semt.message}</p>
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
                className="block w-full p-2 mb-8 border rounded"
                placeholder="LinkedIn Profile URL (Optional)"
              />
              {errors.linkedin && (
                <p className="text-red-500 mb-8">{errors.linkedin.message}</p>
              )}

              <div className="mb-8 mt-4">
                <label className="block mb-2">
                  Do you have a mandatory internship?
                </label>
                <select
                  {...register("mandatoryInternship", {
                    required: "Please select",
                  })}
                  className="block w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.mandatoryInternship && (
                  <p className="text-red-500 mb-8">
                    {errors.mandatoryInternship.message}
                  </p>
                )}
              </div>

              <div className="mb-8 mt-4">
                <label className="block mb-2">
                  Does your school provide your insurance?
                </label>
                <select
                  {...register("hasInsurance", { required: "Please select" })}
                  className="block w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.hasInsurance && (
                  <p className="text-red-500 mb-8">
                    {errors.hasInsurance.message}
                  </p>
                )}
              </div>

              <div className="mb-8 mt-4">
                <label className="block mb-2">
                  Which days are you available to work?
                </label>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                    (day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={day}
                          {...register("workDays", {
                            required: "Please select at least one day",
                          })}
                          className="form-checkbox w-8 h-8 sm:w-6 sm:h-6"
                        />
                        <span>{day}</span>
                      </label>
                    )
                  )}
                </div>
                {errors.workDays && (
                  <p className="text-red-500 mb-8">{errors.workDays.message}</p>
                )}
              </div>

              <button
                type="submit"
                className={`p-2 rounded ${
                  isValid && !isSubmitting && isValidPh
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={isSubmitting || !isValid || !isValidPh}
              >
                Apply for Social Media Intern
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
