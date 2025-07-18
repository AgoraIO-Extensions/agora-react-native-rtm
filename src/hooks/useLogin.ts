import { useEffect } from 'react';

import { RTMClient } from '../api/RTMClient';
import { LoginOptions } from '../api/RTMClient';

export function useLogin(client: RTMClient, loginOptions: LoginOptions) {
  useEffect(() => {
    client.login(loginOptions);
    return () => {
      client?.logout();
    };
  }, [client, loginOptions]);
}
