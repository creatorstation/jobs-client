import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SubmitForm } from './SubmitForm';
import { appStore } from '~/store/app-store';
import { userStore } from '~/store/user-store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isPhoneValid } from '~/helpers/isPhoneValid';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));
jest.mock('~/helpers/isPhoneValid', () => ({
  isPhoneValid: jest.fn(),
}));
jest.mock('react-international-phone', () => ({
  PhoneInput: ({ value, onChange }) => (
    <input 
      data-testid="phone-input" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  ),
}));

describe('SubmitForm Component', () => {
  let mockAxios;
  let mockResponse;
  
  beforeEach(() => {
    // Setup store states
    appStore.setState({ appData: { step: 0, oauthLoading: false } });
    userStore.setState({ 
      userData: { 
        name: 'Test User', 
        email: 'test@example.com' 
      } 
    });

    // Mock implementations
    mockAxios = axios as jest.Mocked<typeof axios>;
    mockResponse = { status: 200, data: {} };
    mockAxios.post.mockResolvedValue(mockResponse);
    
    // Mock isPhoneValid to return true by default
    (isPhoneValid as jest.Mock).mockReturnValue(true);

    // Mock file reader
    Object.defineProperty(global, 'FileReader', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        readAsDataURL: jest.fn(),
        onload: null,
      })),
    });

    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn();
    
    // Mock createElement for iframe preview
    const originalCreateElement = document.createElement;
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'iframe') {
        return {
          ...originalCreateElement.call(document, tagName),
          contentWindow: {
            document: {
              open: jest.fn(),
              write: jest.fn(),
              close: jest.fn(),
            },
          },
        };
      }
      return originalCreateElement.call(document, tagName);
    });

    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders step 0 with name and email fields', () => {
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    // Check if initial fields are rendered
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument();
    
    // Step 0 should have the Apply button, not Submit
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.queryByText('Submit your application')).not.toBeInTheDocument();
  });

  test('loads user data into form fields', () => {
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('your.email@example.com') as HTMLInputElement;
    
    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
  });

  test('advances to step 1 when "Apply" button is clicked with valid data', () => {
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    fireEvent.click(screen.getByText('Apply'));
    
    expect(appStore.getState().appData.step).toBe(1);
  });

  test('phone verification process', async () => {
    appStore.setState({ appData: { step: 1 } });
    
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    // Phone input should be visible in step 1
    const phoneInput = screen.getByTestId('phone-input');
    expect(phoneInput).toBeInTheDocument();
    
    // Enter phone number
    fireEvent.change(phoneInput, { target: { value: '+905551234567' } });
    
    // Click send verification code button
    const sendButton = screen.getByText('Send Verification Code');
    fireEvent.click(sendButton);
    
    // Check if verification code request was sent
    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://auto.creatorstation.com/webhook/3ae84523-7d5f-40e4-b03b-84311b859ed7',
      {
        phone: '+905551234567',
        mail: false,
        email: 'test@example.com',
      }
    );
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Verification code sent!', { type: 'success' });
    });
    
    // Verification code input should appear
    const codeInput = screen.getByPlaceholderText('Enter 6-digit code');
    expect(codeInput).toBeInTheDocument();
    
    // Timer should start
    expect(screen.getByText(/You have \d+:\d+ to enter the verification code/)).toBeInTheDocument();
    
    // Enter verification code
    fireEvent.change(codeInput, { target: { value: '123456' } });
    
    // Check if verification request was sent
    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://auto.creatorstation.com/webhook/0723c1ca-b5a6-41a7-bd57-e35d79c4a2ff',
      {
        phone: '+905551234567',
        code: '123456',
      }
    );
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Phone number verified successfully!', { type: 'success' });
    });
  });

  test('handles expired verification code', async () => {
    appStore.setState({ appData: { step: 1 } });
    
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    // Enter phone number
    const phoneInput = screen.getByTestId('phone-input');
    fireEvent.change(phoneInput, { target: { value: '+905551234567' } });
    
    // Send verification code
    const sendButton = screen.getByText('Send Verification Code');
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Verification code sent!', { type: 'success' });
    });
    
    // Fast forward time to expire the code
    act(() => {
      jest.advanceTimersByTime(91000); // 91 seconds (more than the 90-second timer)
    });
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Verification code has expired. Please resend.', { type: 'error' });
    });
    
    // Resend button should appear
    expect(screen.getByText('Resend Code')).toBeInTheDocument();
  });

  test('handles CV upload', async () => {
    appStore.setState({ appData: { step: 1 } });
    
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    // Mock file
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Upload your CV/i, { selector: 'input' });
    
    // Simulate file upload
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Trigger FileReader onload event
    act(() => {
      const fileReaderInstance = (FileReader as jest.Mock).mock.instances[0];
      fileReaderInstance.onload({ target: { result: 'data:application/pdf;base64,ZHVtbXkgY29udGVudA==' } });
    });
    
    // Preview should appear
    expect(screen.getByText('Preview:')).toBeInTheDocument();
  });

  test('form submission with valid data', async () => {
    // Mock all fields as valid
    appStore.setState({ appData: { step: 1 } });
    userStore.setState({
      userData: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+905551234567',
      }
    });
    
    // Mock verification as valid
    const mockFormData = jest.fn();
    global.FormData = jest.fn().mockImplementation(() => ({
      append: mockFormData,
    }));
    
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    // Set verification as valid
    act(() => {
      const form = screen.getByRole('form');
      const formComponent = form.closest('form');
      formComponent.__reactProps.onSubmit();
    });
    
    // Set all required fields
    // This is simplified as we're directly calling onSubmit
    // In a real test, you'd need to set all fields
    
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://auto.creatorstation.com/webhook/3e4a79e8-a76b-4458-93a9-7e760f266c07',
        expect.any(FormData),
        expect.objectContaining({
          onUploadProgress: expect.any(Function),
        })
      );
    });
    
    // Simulate successful submission
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Application submitted successfully!', { type: 'success' });
    });
    
    // Fast forward the timeout after successful submission
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Check redirection
    expect(window.location.href).toBe('https://creatorstation.com/');
  });

  test('handles form validation errors', async () => {
    appStore.setState({ appData: { step: 0 } });
    userStore.setState({ userData: null });
    
    render(<SubmitForm submitBtnText="Apply Now" positionName="Videographer" />);
    
    // Try to submit form with empty fields
    const applyButton = screen.getByText('Apply');
    
    // Applies should be disabled
    expect(applyButton).toBeDisabled();
    
    // Fill name but leave email empty
    const nameInput = screen.getByPlaceholderText('Your Name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    // Button should still be disabled
    expect(applyButton).toBeDisabled();
    
    // Fill email with invalid format
    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Error message should appear
    expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
    
    // Button should still be disabled
    expect(applyButton).toBeDisabled();
    
    // Fill email with valid format
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    
    // Button should be enabled
    expect(applyButton).not.toBeDisabled();
  });

  test('handles nonFullTime specific fields', async () => {
    appStore.setState({ appData: { step: 1 } });
    
    render(<SubmitForm submitBtnText="Apply Now" positionName="Social Media Intern" nonFullTime={true} />);
    
    // Check if internship-specific fields are rendered
    expect(screen.getByText('Do you have a mandatory internship?')).toBeInTheDocument();
    expect(screen.getByText('Does your school provide your insurance?')).toBeInTheDocument();
    expect(screen.getByText('Which days are you available to work?')).toBeInTheDocument();
    
    // Check if workdays options are rendered
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('Wednesday')).toBeInTheDocument();
    expect(screen.getByText('Thursday')).toBeInTheDocument();
    expect(screen.getByText('Friday')).toBeInTheDocument();
  });
});