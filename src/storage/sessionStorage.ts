import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'pneumonia.accessToken';

export const sessionStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  }),
  clearAccessToken: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
};
