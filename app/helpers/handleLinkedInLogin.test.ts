import { handleLinkedInAuth } from './handleLinkedInLogin';
import axios from 'axios';
import { toast } from 'react-toastify';
import { userStore } from '~/store/user-store';
import { appStore } from '~/store/app-store';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

describe('handleLinkedInAuth', () => {
  let mockAxios;
  let mockLocation;
  let userUpdateSpy;
  let appUpdateSpy;

  beforeEach(() => {
    // Setup mock for window.location and history
    mockLocation = {
      href: 'https://example.com?code=test_code&state=test_state',
      search: '?code=test_code&state=test_state',
      replace: jest.fn(),
      pathname: '/',
      reload: jest.fn(),
    };
    
    // Also mock window.history
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: jest.fn()
      },
      writable: true
    });
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    // Mock axios
    mockAxios = axios as jest.Mocked<typeof axios>;
    
    // Spy on store updates
    userUpdateSpy = jest.spyOn(userStore.getState(), 'updateUserData');
    appUpdateSpy = jest.spyOn(appStore.getState(), 'updateAppData');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('extracts code from URL query parameters', async () => {
    const mockResponse = {
      data: {
        name: 'LinkedIn User',
        email: 'linkedin@example.com',
      },
    };
    mockAxios.get.mockResolvedValueOnce(mockResponse);
    
    // Call with required parameters based on actual implementation
    const redirectUri = 'https://example.com/callback';
    const updateUserData = jest.fn();
    const updateAppData = jest.fn();
    
    await handleLinkedInAuth(redirectUri, updateUserData, updateAppData);

    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://i4qbeevmo5.execute-api.us-east-1.amazonaws.com/v1/api/auth/linkedin',
      { 
        params: {
          code: 'test_code',
          redirect_uri: redirectUri
        }
      }
    );
  });

  test('updates user data on successful response', async () => {
    const mockResponse = {
      data: {
        name: 'LinkedIn User',
        email: 'linkedin@example.com',
      },
    };
    mockAxios.get.mockResolvedValueOnce(mockResponse);
    
    // Create explicit function mocks rather than spying on store methods
    const updateUserData = jest.fn();
    const updateAppData = jest.fn();
    
    // Mock the Promise resolution to allow the chain to complete
    await handleLinkedInAuth('https://example.com/callback', updateUserData, updateAppData);
    
    // Create a Promise that resolves in the next tick to allow all .then and .finally handlers to run
    await new Promise(process.nextTick);

    expect(updateUserData).toHaveBeenCalledWith({
      name: 'LinkedIn User',
      email: 'linkedin@example.com',
    });
    expect(toast).toHaveBeenCalledWith('Signed in successfully!', { type: 'success' });
    
    // Verify both calls to updateAppData (first with true, then with false)
    expect(updateAppData).toHaveBeenCalledTimes(2);
    expect(updateAppData).toHaveBeenNthCalledWith(1, { oauthLoading: true });
    expect(updateAppData).toHaveBeenNthCalledWith(2, { oauthLoading: false });
  });

  test('handles API error correctly', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const updateUserData = jest.fn();
    const updateAppData = jest.fn();
    
    await handleLinkedInAuth('https://example.com/callback', updateUserData, updateAppData);
    
    // Create a Promise that resolves in the next tick to allow all promises to settle
    await new Promise(process.nextTick);

    // Check that the loading state is updated in finally block
    expect(updateAppData).toHaveBeenCalledTimes(2);
    expect(updateAppData).toHaveBeenNthCalledWith(1, { oauthLoading: true });
    expect(updateAppData).toHaveBeenNthCalledWith(2, { oauthLoading: false });
    
    // The window.history.replaceState should have been called in the error handler
    expect(window.history.replaceState).toHaveBeenCalled();
    
    // Check if location reload was called
    expect(mockLocation.reload).toHaveBeenCalled();
  });

  test('does nothing when code is not present in URL', async () => {
    // Set URL without code parameter
    mockLocation.search = '';
    mockLocation.href = 'https://example.com';

    const updateUserData = jest.fn();
    const updateAppData = jest.fn();
    
    await handleLinkedInAuth('https://example.com/callback', updateUserData, updateAppData);

    expect(mockAxios.get).not.toHaveBeenCalled();
    expect(updateUserData).not.toHaveBeenCalled();
    expect(updateAppData).not.toHaveBeenCalled();
  });

  test('handles special characters in code parameter', async () => {
    // Set URL with special characters in code
    mockLocation.search = '?code=special%26chars%3D&state=test_state';
    mockLocation.href = 'https://example.com?code=special%26chars%3D&state=test_state';

    const mockResponse = {
      data: {
        name: 'LinkedIn User',
        email: 'linkedin@example.com',
      },
    };
    mockAxios.get.mockResolvedValueOnce(mockResponse);

    const updateUserData = jest.fn();
    const updateAppData = jest.fn();
    
    await handleLinkedInAuth('https://example.com/callback', updateUserData, updateAppData);

    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://i4qbeevmo5.execute-api.us-east-1.amazonaws.com/v1/api/auth/linkedin',
      { 
        params: {
          code: 'special&chars=',
          redirect_uri: 'https://example.com/callback'
        }
      }
    );
  });
});