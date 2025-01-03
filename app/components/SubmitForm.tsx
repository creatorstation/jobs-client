import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import { toast } from "react-toastify";
import { isPhoneValid } from "~/helpers/isPhoneValid";
import { userStore } from "~/store/user-store";

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

export interface SubmitFormProps {
  submitBtnText: string;
  positionName: string;
  nonFullTime?: boolean;
}

export function SubmitForm({
  submitBtnText,
  positionName,
  nonFullTime = false,
}: SubmitFormProps) {
  const { userData, updateUserData } = userStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = (data: UserData) => {
    setIsSubmitting(true);
    updateUserData(data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone.replace(/\s/g, ""));
    formData.append("europeSide", data.europeSide);
    formData.append("semt", data.semt);
    formData.append("cv", data.cv[0]);
    formData.append("linkedin", data.linkedin);
    formData.append("position", positionName);

    if (nonFullTime) {
      const dayMapping: Record<string, string> = {
        Monday: "Pazartesi",
        Tuesday: "Salı",
        Wednesday: "Çarşamba",
        Thursday: "Perşembe",
        Friday: "Cuma",
      };
      const translatedWorkDays = data.workDays.map((day) => dayMapping[day]);

      formData.append(
        "mandatoryInternship",
        data.mandatoryInternship.toString()
      );
      formData.append("hasInsurance", data.hasInsurance.toString());
      formData.append("workDays", translatedWorkDays.join(","));
    }

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
        setIsSubmitting(false);
      });
  };

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
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
          updateUserData({ ...userData, phone } as UserData);
          setValue("phone", phone);
          trigger("phone");
        }}
      />
      {!isValidPh && (
        <p className="text-red-500 mb-6">Please enter a valid phone number.</p>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className="mb-8 p-4 border-dashed border-2 border-gray-300 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
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
                trigger("cv");

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
            <iframe src={filePreview} className="w-full h-64 border rounded" />
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
          <p className="text-red-500 mb-8">{errors.europeSide.message}</p>
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
            value: /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
            message: "Invalid LinkedIn URL",
          },
        })}
        className="block w-full p-2 mb-8 border rounded"
        placeholder="LinkedIn Profile URL (Optional)"
      />
      {errors.linkedin && (
        <p className="text-red-500 mb-8">{errors.linkedin.message}</p>
      )}

      {nonFullTime && (
        <>
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
              <p className="text-red-500 mb-8">{errors.hasInsurance.message}</p>
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
        </>
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
        {submitBtnText}
      </button>
    </form>
  );
}
