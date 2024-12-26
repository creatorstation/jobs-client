import { GoogleLogin } from "@react-oauth/google";
import type { Route } from "./+types/page";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CreatorStation | Social Media Manager" },
    {
      name: "description",
      content:
        "Join CreatorStation as a Social Media Manager and contribute to top Turkish YouTube channels!",
    },
  ];
}

export default function SocialMediaManager() {
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
    formState: { errors, isValid },
    trigger, // Add trigger to manually trigger validation
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
    formData.append("position", "Social Media Manager");

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
          trigger("cv"); // Trigger validation for CV
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

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Social Media Manager
      </h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About CreatorStation</h2>
        <p className="text-gray-700">
          CreatorStation is Turkey’s premier influencer marketing and talent
          management agency, spearheading some of the country’s top social media
          channels and producing captivating original content across
          entertainment, education, style, beauty, and travel. With a commitment
          to innovation and storytelling, we thrive on building influential
          communities that engage audiences and shape the cultural conversation.
        </p>
        <h3 className="text-xl font-semibold mt-4">What You’ll Do</h3>
        <p className="text-gray-700">
          As our Senior Social Media Manager, you will be instrumental in
          shaping and driving the strategic vision for our social channels. You
          will lead a team dedicated to producing compelling, platform-specific
          content that both resonates with our followers and advances our
          clients’ goals. This role will involve working closely with
          influencers, creators, and our internal production team to deliver
          exceptional results.
        </p>
        <h3 className="text-xl font-semibold mt-4">Key Responsibilities</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Strategic Planning & Execution: Develop and implement data-driven
            social media strategies across TikTok, Instagram, and LinkedIn that
            align with our clients’ brand narratives and business objectives.
          </li>
          <li>
            Content Oversight: Guide the end-to-end content lifecycle—from
            ideation and scripting to production and publishing—ensuring the
            quality, consistency, and timeliness of all outputs.
          </li>
          <li>
            Team Leadership: Manage and mentor a team of social media
            associates, content creators, and interns, fostering a
            collaborative, high-performance environment.
          </li>
          <li>
            Performance Analysis: Track and analyze key metrics (engagement,
            reach, follower growth) to refine strategies, deliver actionable
            insights, and communicate results to stakeholders.
          </li>
          <li>
            Influencer & Partner Relations: Work closely with top Turkish
            influencers and brand partners, negotiating collaborations,
            overseeing campaigns, and ensuring optimal brand representation.
          </li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Experience: A minimum of 3 years of professional experience in
            social media management, ideally within an agency or brand
            environment.
          </li>
          <li>
            Platform Expertise: Deep understanding of social platforms
            (Instagram, TikTok, LinkedIn) and emerging trends.
          </li>
          <li>
            Technical Skills: Proficiency with content creation tools (e.g.,
            Canva) and familiarity with video and photo editing software.
          </li>
          <li>
            Communication & Leadership: Exceptional verbal and written
            communication skills in Turkish and a strong command of English;
            proven ability to lead, inspire, and develop team members.
          </li>
          <li>
            Location: Full-time, onsite role at our Vadistanbul office (European
            side of Istanbul).
          </li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">What’s in It for You?</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Growth & Impact: Play a pivotal role in shaping the social presence
            of leading brands and influencers.
          </li>
          <li>
            Team Environment: Join a forward-thinking, collaborative team that
            values creativity, innovation, and strategic insight.
          </li>
          <li>
            Professional Development: Hone your leadership, digital marketing,
            and social media skills in a vibrant, fast-paced setting.
          </li>
        </ul>
        <p className="mt-4">
          <strong>Ready to Lead the Conversation?</strong>
        </p>
        <p className="text-gray-700">
          If you’re ready to elevate your career and make a lasting impact in
          the world of social media, apply now and help shape the future of our
          digital storytelling at CreatorStation!
        </p>
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
                setUserData(decoded);
                toast("Signed in successfully!", { type: "success" });
              }}
              onError={() => {
                toast("An error occurred while signing in.", { type: "error" });
              }}
              useOneTap={true}
              text="continue_with"
            />
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
              {...register("phone")}
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
              placeholder="LinkedIn Profile URL"
            />
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
              Apply for Social Media Manager
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
