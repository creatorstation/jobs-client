import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthButtons } from './AuthButtons';
import { appStore } from '~/store/app-store';
import { userStore } from '~/store/user-store';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(({ onSuccess, onError }) => () => {
    // Return a function that can be called to simulate login
    return { login: jest.fn() };
  }),
}));

describe('AuthButtons Component', () => {
  let mockAxios;
  let originalWindow;

  beforeEach(() => {
    // Reset store states
    appStore.setState({ appData: { step: 0, oauthLoading: false } });
    userStore.setState({ userData: null });

    // Save original window.location and mock it
    originalWindow = window.location;
    delete window.location;
    window.location = { href: '', origin: 'https://example.com' };

    // Mock axios
    mockAxios = axios as jest.Mocked<typeof axios>;
  });

  afterEach(() => {
    // Restore original window
    window.location = originalWindow;
    jest.clearAllMocks();
  });

  test('renders Google and LinkedIn buttons', () => {
    render(<AuthButtons redirPath="videographer" />);
    
    expect(screen.getByText('Apply with Google')).toBeInTheDocument();
    expect(screen.getByText('Apply with LinkedIn')).toBeInTheDocument();
    expect(screen.getByAltText('google logo')).toBeInTheDocument();
    expect(screen.getByAltText('linkedin logo')).toBeInTheDocument();
  });

  test('displays loading state when oauthLoading is true', () => {
    appStore.setState({ appData: { oauthLoading: true } });
    render(<AuthButtons redirPath="videographer" />);
    
    expect(screen.getAllByText('Loading...').length).toBe(2);
    expect(screen.getByAltText('google logo')).toBeInTheDocument();
    expect(screen.getByAltText('linkedin logo')).toBeInTheDocument();
  });

  test('redirects to LinkedIn when LinkedIn button is clicked', () => {
    render(<AuthButtons redirPath="videographer" />);
    
    const linkedInButton = screen.getByText('Apply with LinkedIn').closest('button');
    fireEvent.click(linkedInButton);
    
    // Check if loading state is updated
    expect(appStore.getState().appData.oauthLoading).toBe(true);
    
    // Check if redirect URL is correctly formed
    expect(window.location.href).toContain('https://www.linkedin.com/oauth/v2/authorization');
    expect(window.location.href).toContain('client_id=77bdm9yb1yeig5');
    expect(window.location.href).toContain('redirect_uri=https%3A%2F%2Fexample.com%2Fvideographer');
  });

  test('updates user data on successful Google login', async () => {
    // Mock successful Google login response
    const mockUserInfo = {
      data: {
        email: 'test@example.com',
        name: 'Test User',
      }
    };
    mockAxios.get.mockResolvedValueOnce(mockUserInfo);

    const { useGoogleLogin } = require('@react-oauth/google');
    let onSuccessCallback;
    useGoogleLogin.mockImplementation(({ onSuccess }) => {
      onSuccessCallback = onSuccess;
      return jest.fn();
    });

    render(<AuthButtons redirPath="videographer" />);
    
    const googleButton = screen.getByText('Apply with Google').closest('button');
    fireEvent.click(googleButton);
    
    // Simulate successful login
    onSuccessCallback({ access_token: 'fake-token' });
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { params: { access_token: 'fake-token' } }
      );
    });

    await waitFor(() => {
      const userData = userStore.getState().userData;
      expect(userData).toEqual({
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(toast).toHaveBeenCalledWith('Signed in successfully!', { type: 'success' });
      expect(appStore.getState().appData.oauthLoading).toBe(false);
    });
  });

  test('handles Google login error', async () => {
    const { useGoogleLogin } = require('@react-oauth/google');
    let onErrorCallback;
    useGoogleLogin.mockImplementation(({ onError }) => {
      onErrorCallback = onError;
      return jest.fn();
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<AuthButtons redirPath="videographer" />);
    
    // Simulate error
    onErrorCallback('Login failed');
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login failed');
      expect(toast).toHaveBeenCalledWith('An error occurred while signing in.', { type: 'error' });
      expect(appStore.getState().appData.oauthLoading).toBe(false);
    });

    consoleSpy.mockRestore();
  });
});