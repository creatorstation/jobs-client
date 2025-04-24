import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { toast } from 'react-toastify';
import { isPhoneValid } from '~/helpers/isPhoneValid';
import { userStore } from '~/store/user-store';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { appStore } from '~/store/app-store';

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
  salaryExpectation?: string;
  startDate?: string;
  instagram?: string;
  educationStatus?: string;
  englishLevel?: string;
  influencerMarketingExperience?: string;
  brandExperience?: string;
};

export interface SubmitFormProps {
  submitBtnText: string;
  positionName: string;
  nonFullTime?: boolean;
}

export function SubmitForm({ submitBtnText, positionName, nonFullTime = false }: SubmitFormProps) {
  const { appData, updateAppData } = appStore();

  // State to store fields from API response
  const [requiredFields, setRequiredFields] = useState<Record<string, string[]>>({});
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    // Get the current URL path
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || '';
    setCurrentPath(lastSegment);

    axios
      .get('https://auto.creatorstation.com/webhook/83de1aba-17c8-4868-8f7d-be34b7d4feea')
      .then((response) => {
        console.log('Request sent successfully', response.data);
        setRequiredFields(response.data);
      })
      .catch((error) => {
        console.error('Error sending request:', error);
      });
  }, []);

  // Function to check if a field should be rendered
  const shouldRenderField = (fieldName: string): boolean => {
    // Always show the field if it's in the requiredFields and includes the current path
    if (requiredFields[fieldName] && requiredFields[fieldName].length > 0) {
      return requiredFields[fieldName].includes(currentPath);
    }
    return false;
  };

  const { userData, updateUserData } = userStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleNext = () => {
    if (isValid) {
      updateAppData({ step: 1 });
    }
  };

  const [verificationAttempts, setVerificationAttempts] = useState<number>(0);

  const [verification, setVerification] = useState<{
    isVerifying: boolean;
    codeSent: boolean;
    code: string;
    isValid: boolean;
    error: string;
    resendCooldown: number;
  }>({
    isVerifying: false,
    codeSent: false,
    code: '',
    isValid: false,
    error: '',
    resendCooldown: 0,
  });

  const [checkingForCode, setCheckingForCode] = useState<boolean>(false);
  const [verificationTimer, setVerificationTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Update showAdditionalQuestions state based on verification status
  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState<boolean>(false);

  // Update showAdditionalQuestions when verification status changes
  useEffect(() => {
    setShowAdditionalQuestions(verification.isValid);
  }, [verification.isValid]);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<UserData>({
    mode: 'all',
  });

  useEffect(() => {
    if (userData) {
      setValue('name', userData.name as string);
      setValue('email', userData.email as string);
      if (userData.phone) setValue('phone', userData.phone);
      if (userData.europeSide) setValue('europeSide', userData.europeSide);
      if (userData.semt) setValue('semt', userData.semt);
      if (userData.linkedin) setValue('linkedin', userData.linkedin);
    }
  }, [userData, setValue]);

  const handleInputChange = (field: keyof UserData, value: string) => {
    // @ts-ignore
    updateUserData({ ...userData, [field]: value });
    setValue(field, value);
    trigger(field);
  };

  const onSubmit = (data: UserData) => {
    if (!verification.isValid) {
      toast('Please verify your phone number before submitting.', {
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    updateUserData(data);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone.replace(/\s/g, ''));
    formData.append('europeSide', data.europeSide);
    formData.append('semt', data.semt);
    formData.append('cv', data.cv[0]);
    formData.append('linkedin', data.linkedin);
    formData.append('position', positionName);

    if (showAdditionalQuestions) {
      if (data.salaryExpectation) formData.append('salaryExpectation', data.salaryExpectation);
      if (data.startDate) formData.append('startDate', data.startDate);
      if (data.instagram) formData.append('instagram', data.instagram);
      if (data.educationStatus) formData.append('educationStatus', data.educationStatus);
      if (data.englishLevel) formData.append('englishLevel', data.englishLevel);
      if (data.influencerMarketingExperience)
        formData.append('influencerMarketingExperience', data.influencerMarketingExperience);
      if (data.brandExperience) formData.append('brandExperience', data.brandExperience);
    }

    if (nonFullTime) {
      const dayMapping: Record<string, string> = {
        Monday: 'Pazartesi',
        Tuesday: 'Salı',
        Wednesday: 'Çarşamba',
        Thursday: 'Perşembe',
        Friday: 'Cuma',
      };
      const translatedWorkDays = data.workDays.map((day) => dayMapping[day]);

      formData.append('mandatoryInternship', data.mandatoryInternship.toString());
      formData.append('hasInsurance', data.hasInsurance.toString());
      formData.append('workDays', translatedWorkDays.join(','));
    }

    axios
      .post('https://auto.creatorstation.com/webhook/3e4a79e8-a76b-4458-93a9-7e760f266c07', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      })
      .then(async (response) => {
        console.log(response);
        toast('Application submitted successfully!', { type: 'success' });

        await new Promise((resolve) => setTimeout(resolve, 3000));

        window.location.href = 'https://creatorstation.com/';
      })
      .catch((error) => {
        console.error(error);
        toast('An error occurred while submitting the application.', {
          type: 'error',
        });
        setIsSubmitting(false);
      });
  };

  const isValidPh = isPhoneValid(userData?.phone || '');

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (
          file.type === 'application/pdf' ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          setValue('cv', files as unknown as FileList);
          trigger('cv');
          console.log('Files dropped:', files);
          const reader = new FileReader();
          reader.onload = (e) => {
            setFilePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          toast('Only PDF and DOCX files are supported.', {
            type: 'error',
          });
        }
      }
    },
    [setValue, trigger],
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

  const sendVerificationCode = async () => {
    try {
      const newAttemptCount = verificationAttempts + 1;
      setVerificationAttempts(newAttemptCount);

      const requestData: any = {
        phone: (userData as UserData).phone.replace(/\s/g, ''),
        mail: newAttemptCount > 1,
        email: userData?.email || '',
      };

      await axios.post('https://auto.creatorstation.com/webhook/3ae84523-7d5f-40e4-b03b-84311b859ed7', requestData);

      if (newAttemptCount === 1) {
        toast('Verification code sent!', { type: 'success' });
      } else {
        toast('Verification code sent via WhatsApp and email!', { type: 'success' });
      }

      setVerification((prev) => ({
        ...prev,
        codeSent: true,
        isVerifying: true,
        resendCooldown: 90,
      }));
      setVerificationTimer(90);
    } catch (error) {
      console.error(error);
      toast('Failed to send verification code.', { type: 'error' });
    }
  };

  const verifyCode = async (code: string) => {
    setCheckingForCode(true);
    if (verificationTimer <= 0) {
      toast('Verification code has expired. Please resend.', { type: 'error' });
      return;
    }
    try {
      const response = await axios.post(
        'https://auto.creatorstation.com/webhook/0723c1ca-b5a6-41a7-bd57-e35d79c4a2ff',
        {
          phone: (userData as UserData).phone.replace(/\s/g, ''),
          code: code,
        },
      );

      if (response.status === 200) {
        toast('Phone number verified successfully!', { type: 'success' });
        setVerification((prev) => ({
          ...prev,
          isValid: true,
          isVerifying: false,
          error: '',
        }));
        setVerificationTimer(0);
      } else {
        setVerification((prev) => ({
          ...prev,
          error: 'Invalid verification code.',
        }));
        toast('Invalid verification code.', { type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setVerification((prev) => ({
        ...prev,
        error: 'Failed to verify code.',
      }));
      toast('Failed to verify code.', { type: 'error' });
    }

    setCheckingForCode(false);
  };

  const handleResendCode = () => {
    sendVerificationCode();
  };

  useEffect(() => {
    if (verificationTimer > 0) {
      timerRef.current = setInterval(() => {
        setVerificationTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [verificationTimer]);

  useEffect(() => {
    if (verificationTimer === 0 && verification.isVerifying) {
      setVerification((prev) => ({
        ...prev,
        isVerifying: false,
        error: 'Verification code expired.',
      }));
      toast('Verification code has expired. Please resend.', { type: 'error' });
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [verificationTimer, verification.isVerifying]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verification.resendCooldown > 0) {
      timer = setTimeout(() => {
        setVerification((prev) => ({
          ...prev,
          resendCooldown: prev.resendCooldown - 1,
        }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [verification.resendCooldown]);

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const buttonVariants = {
    hover: {
      scale: 1.04,
      boxShadow: '0px 0px 3px rgb(0, 0, 0)',
      transition: {
        yoyo: Infinity,
      },
    },
    tap: { scale: 0.95 },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  const uploadProgressVariants = {
    hidden: { width: 0 },
    visible: { width: `${uploadProgress}%` },
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (userData) {
      const timer = setTimeout(() => {
        trigger(['name', 'email']);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [userData, trigger]);

  useEffect(() => {
    console.log('userData:', userData);
  }, [userData]);

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {appData.step === 0 && (
        <>
          <motion.div variants={fieldVariants} className="mb-4">
            <motion.input
              type="text"
              {...register('name', { required: 'Name is required.' })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Name"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 100 }}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fieldVariants} className="mb-4">
            <motion.input
              type="email"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email address.',
                },
              })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="your.email@example.com"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 100 }}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.button
            type="button"
            onClick={handleNext}
            className={`w-64 p-2 rounded ${
              isValid ? 'bg-blue-500 text-white' : 'bg-[#e9e9ed] text-black cursor-not-allowed'
            }`}
            disabled={!isValid}
            variants={buttonVariants}
            whileHover={isValid ? 'hover' : {}}
            whileTap="tap"
            transition={{ type: 'spring', stiffness: 100 }}
          >
            Apply
          </motion.button>
        </>
      )}

      {appData.step === 1 && (
        <>
          <motion.div variants={fieldVariants} className="mb-4 relative">
            <PhoneInput
              className={`w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                verification.isValid ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              inputStyle={{ border: 'none', width: '100%', fontSize: '1rem' }}
              countrySelectorStyleProps={{
                buttonStyle: {
                  border: 'none',
                },
              }}
              defaultCountry="tr"
              value={userData?.phone || ''}
              onChange={(phone) => {
                updateUserData({ ...userData, phone } as UserData);
                setValue('phone', phone);
                trigger('phone');
                setVerification((prev) => ({
                  ...prev,
                  isValid: false,
                  codeSent: false,
                  isVerifying: false,
                  code: '',
                  error: '',
                }));
                setVerificationTimer(0);
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                }
              }}
              disabled={verification.isValid}
            />
            {verification.isValid && <FaCheckCircle className="absolute top-[18px] right-5 text-green-500 text-xl" />}
            {!isValidPh && (
              <AnimatePresence>
                <motion.p
                  className="text-red-500 text-sm mb-2"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  Please enter a valid phone number.
                </motion.p>
              </AnimatePresence>
            )}

            {isValidPh && (
              <AnimatePresence>
                {!verification.isValid && (
                  <motion.div
                    className="mb-4 p-4 border rounded bg-yellow-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {!verification.codeSent ? (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        type="button"
                        onClick={sendVerificationCode}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Send Verification Code
                      </motion.button>
                    ) : (
                      <motion.div className="mt-4" initial="hidden" animate="visible" variants={formVariants}>
                        <motion.p
                          className="text-gray-700 text-sm mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {verificationAttempts >= 2
                            ? `We've sent a verification code via WhatsApp and `
                            : `We've sent a verification code via WhatsApp to ${userData?.phone}. Please enter the code below to confirm it's really you.`}
                          {verificationAttempts >= 2 && <strong>email</strong>}
                          {verificationAttempts >= 2 && ` to ${userData?.phone} and to `}
                          {verificationAttempts >= 2 && <strong>{userData?.email}</strong>}
                          {verificationAttempts >= 2 && `. Please enter the code below to confirm it's really you.`}
                        </motion.p>
                        <motion.input
                          type="text"
                          value={verification.code}
                          onChange={(e) => {
                            const code = e.target.value.replace(/\D/g, '');
                            setVerification((prev) => ({
                              ...prev,
                              code,
                            }));
                            if (code.length === 6) {
                              verifyCode(code); // Pass the current 'code' to verifyCode
                            }
                          }}
                          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          pattern="\d*"
                          disabled={checkingForCode}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 100 }}
                        />
                        {verification.error && (
                          <motion.p
                            className="text-red-500 text-sm mb-2"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                          >
                            {verification.error}
                          </motion.p>
                        )}
                        {verificationTimer > 0 && (
                          <motion.p
                            className="text-gray-700 text-sm mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            You have {formatTime(verificationTimer)} to enter the verification code.
                          </motion.p>
                        )}
                        <div className="flex space-x-4">
                          {verification.error && verificationTimer <= 0 && (
                            <motion.button
                              type="button"
                              disabled={checkingForCode}
                              onClick={handleResendCode}
                              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Resend Code
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Show all form fields only after verification */}
          {verification.isValid && (
            <>
              <motion.div variants={fieldVariants} className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div
                  className="p-4 border-dashed border-2 rounded cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={handleClick}
                  whileHover={{ backgroundColor: '#f0f4f8' }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="file"
                    {...register('cv', { required: 'CV is required' })}
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf, .docx"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        if (
                          file.type === 'application/pdf' ||
                          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        ) {
                          setValue('cv', files as unknown as FileList);
                          trigger('cv');

                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setFilePreview(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          toast('Only PDF and DOCX files are supported.', {
                            type: 'error',
                          });
                          e.target.value = '';
                        }
                      }
                    }}
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm"
                  >
                    Upload your CV (PDF or DOC)
                    <br />
                    or drag and drop it here.
                  </motion.p>

                  <AnimatePresence>
                    {errors.cv && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {errors.cv!.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {filePreview && (
                  <div className="mt-2 mb-8">
                    <p>Preview:</p>
                    {filePreview?.startsWith('data:application/pdf') ? (
                      <iframe src={filePreview as string} className="w-full h-64 border rounded" />
                    ) : (
                      <p>File type not supported for preview.</p>
                    )}
                  </div>
                )}
              </motion.div>

              <motion.div variants={fieldVariants} className="mb-4">
                <label className="block mb-2">Do you live on Istanbul's European side?</label>
                <motion.select
                  {...register('europeSide', { required: 'This field is required.' })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  defaultValue=""
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </motion.select>
                <AnimatePresence>
                  {errors.europeSide && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {errors.europeSide!.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={fieldVariants} className="mb-4">
                <motion.input
                  type="text"
                  {...register('semt', { required: 'This field is required.' })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Disctrict (e.g. Beşiktaş)"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
                <AnimatePresence>
                  {errors.semt && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {errors.semt!.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={fieldVariants} className="mb-4">
                <motion.input
                  type="url"
                  {...register('linkedin', {
                    pattern: {
                      value: /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/,
                      message: 'Enter a valid LinkedIn URL.',
                    },
                  })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
                <AnimatePresence>
                  {errors.linkedin && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {errors.linkedin!.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {shouldRenderField('salary_expectation') && (
                <motion.div variants={fieldVariants} className="mb-4">
                  <label className="block mb-2">Bu pozisyon için maaş beklentin nedir?</label>
                  <motion.textarea
                    {...register('salaryExpectation', { required: 'Bu alan zorunludur.' })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Maaş beklentinizi belirtiniz"
                    rows={3}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                  <AnimatePresence>
                    {errors.salaryExpectation && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {errors.salaryExpectation!.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              <motion.div variants={fieldVariants} className="mb-4">
                <label className="block mb-2">Anlaşmamız durumunda hangi tarihte işe başlayabilirsin?</label>
                <motion.input
                  type="date"
                  {...register('startDate', { required: 'Bu alan zorunludur.' })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
                <AnimatePresence>
                  {errors.startDate && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {errors.startDate!.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {shouldRenderField('instagram_account') && (
                <motion.div variants={fieldVariants} className="mb-4">
                  <label className="block mb-2">Instagram hesabın:</label>
                  <motion.input
                    type="text"
                    {...register('instagram', {
                      pattern: {
                        value: /^[a-z0-9_.]{1,30}$/,
                        message:
                          'Geçerli bir Instagram kullanıcı adı giriniz (sadece küçük harfler, rakamlar, _ ve . karakterleri).',
                      },
                      setValueAs: (value: string) => value.toLowerCase(),
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="username"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    onChange={(e) => {
                      const lowercaseValue = e.target.value.toLowerCase();
                      e.target.value = lowercaseValue;
                    }}
                  />
                  <AnimatePresence>
                    {errors.instagram && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {errors.instagram!.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {shouldRenderField('education_status') && (
                <motion.div variants={fieldVariants} className="mb-4">
                  <label className="block mb-2">Eğitim Durumun (Üniversite)</label>
                  <motion.select
                    {...register('educationStatus', { required: 'Bu alan zorunludur.' })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue=""
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <option value="" disabled>
                      Seçiniz
                    </option>
                    <option value="Devam Ediyor">Devam Ediyor</option>
                    <option value="Mezun Oldum">Mezun Oldum</option>
                    <option value="Bu Yıl Mezun Oluyorum">Bu Yıl Mezun Oluyorum</option>
                  </motion.select>
                  <AnimatePresence>
                    {errors.educationStatus && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {errors.educationStatus!.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {shouldRenderField('english_level') && (
                <motion.div variants={fieldVariants} className="mb-4">
                  <label className="block mb-2">İngilizce seviyen için 1 ve 5 arasında kaç puan verirsin?</label>
                  <motion.select
                    {...register('englishLevel', { required: 'Bu alan zorunludur.' })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue=""
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <option value="" disabled>
                      Seçiniz
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </motion.select>
                  <AnimatePresence>
                    {errors.englishLevel && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {errors.englishLevel!.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {shouldRenderField('influencer_marketing_projects') && (
                <motion.div variants={fieldVariants} className="mb-4">
                  <label className="block mb-2">
                    Daha önce Influencer Marketing projeleri gerçekleştirdin mi? Gerçekleştirdiysen en beğendiğin ya da
                    ilk aklına gelen proje/projeler nedir?
                  </label>
                  <motion.textarea
                    {...register('influencerMarketingExperience', { required: 'Bu alan zorunludur.' })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Deneyimlerinizi paylaşın"
                    rows={4}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                  <AnimatePresence>
                    {errors.influencerMarketingExperience && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {errors.influencerMarketingExperience!.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {shouldRenderField('brief_to_report_service_for_a_brand') && (
                <motion.div variants={fieldVariants} className="mb-4">
                  <label className="block mb-2">
                    Brieften raporlamaya kadar baştan sona hizmet verdiğin ya da süreçlerinde bulunduğun bir marka var
                    mı?
                  </label>
                  <motion.textarea
                    {...register('brandExperience', { required: 'Bu alan zorunludur.' })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Marka deneyimlerinizi paylaşın"
                    rows={4}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                  <AnimatePresence>
                    {errors.brandExperience && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {errors.brandExperience!.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {nonFullTime && (
                <motion.div variants={fieldVariants} className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-4">
                    <label className="block mb-2">Do you have a mandatory internship?</label>
                    <motion.select
                      {...register('mandatoryInternship', {
                        required: 'This field is required.',
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      defaultValue=""
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 100 }}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </motion.select>
                    <AnimatePresence>
                      {errors.mandatoryInternship && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          {errors.mandatoryInternship!.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2">Does your school provide your insurance?</label>
                    <motion.select
                      {...register('hasInsurance', {
                        required: 'This field is required.',
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      defaultValue=""
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 100 }}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </motion.select>
                    <AnimatePresence>
                      {errors.hasInsurance && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          {errors.hasInsurance!.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2">Which days are you available to work?</label>
                    <motion.div
                      className="flex flex-col md:flex-row flex-wrap justify-center"
                      initial="hidden"
                      animate="visible"
                      variants={formVariants}
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                        <motion.label
                          key={day}
                          className="mb-4 md:mb-0 md:mr-4 flex items-center mt-4"
                          variants={fieldVariants}
                        >
                          <motion.input
                            type="checkbox"
                            value={day}
                            {...register('workDays', {
                              validate: (value) => value.length > 0 || 'At least one workday must be selected.',
                            })}
                            className="form-checkbox w-8 h-8 md:w-6 md:h-6"
                            whileTap={{ scale: 0.95 }}
                          />
                          <motion.span
                            className="ml-2 text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {day}
                          </motion.span>
                        </motion.label>
                      ))}
                    </motion.div>
                    <AnimatePresence>
                      {errors.workDays && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          {errors.workDays!.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </>
          )}

          <motion.button
            type="submit"
            className={`w-full p-2 rounded ${
              isValid && !isSubmitting && isValidPh && (verification.isValid || !verification.isVerifying)
                ? 'bg-blue-500 text-white'
                : 'bg-[#e9e9ed] text-black cursor-not-allowed'
            }`}
            disabled={isSubmitting || !isValid || !isValidPh || (verification.isVerifying && !verification.isValid)}
            variants={buttonVariants}
            whileHover={
              isValid && !isSubmitting && isValidPh && (verification.isValid || !verification.isVerifying)
                ? 'hover'
                : {}
            }
            whileTap="tap"
            transition={{ type: 'spring', stiffness: 100 }}
          >
            Submit your application
          </motion.button>
        </>
      )}

      {isSubmitting && (
        <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <label className="block mb-2">Uploading: {uploadProgress}%</label>
          <div className="w-full bg-gray-200 rounded">
            <motion.div
              className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded"
              variants={uploadProgressVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.form>
  );
}
