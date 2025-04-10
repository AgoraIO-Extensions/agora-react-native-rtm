import { IRtmClient } from 'agora-react-native-rtm';
import { useContext } from 'react';

import React, { ReactNode, createContext } from 'react';

export interface RTMProviderProps {
  readonly client: IRtmClient;
  readonly children?: ReactNode;
}

export const AgoraRTMContext = /* @__PURE__ */ createContext<IRtmClient | null>(
  null
);

export function RTMProvider({ client, children }: RTMProviderProps) {
  return (
    <AgoraRTMContext.Provider value={client}>
      {children}
    </AgoraRTMContext.Provider>
  );
}

function useOptionalRTM(client?: IRtmClient | null): IRtmClient | null {
  const clientFromContext = useContext(AgoraRTMContext);
  return client || clientFromContext;
}

export function useRtm(client?: IRtmClient | null): IRtmClient {
  const resolvedClient = useOptionalRTM(client);

  if (!resolvedClient) {
    throw new Error(
      'Agora RTM client not found. Should be wrapped in <RTMProvider value={client} />'
    );
  }

  return resolvedClient;
}
