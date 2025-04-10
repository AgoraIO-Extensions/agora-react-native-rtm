import { useEffect } from 'react';

import { IRtmClient } from '../IAgoraRtmClient';

export function useLogin(
  client: IRtmClient,
  token: string,
  requestId?: number
) {
  useEffect(() => {
    client.login(token, requestId);
    return () => {
      client?.logout();
    };
  }, [client, requestId, token]);
}
