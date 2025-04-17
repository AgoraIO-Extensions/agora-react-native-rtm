import { useContext } from 'react';

import React, { ReactNode, createContext } from 'react';

import { RTMClient } from '../api/RTMClient';

export interface RTMProviderProps {
  readonly client: RTMClient;
  readonly children?: ReactNode;
}

export const AgoraRTMContext = /* @__PURE__ */ createContext<RTMClient | null>(
  null
);

export function RTMProvider({ client, children }: RTMProviderProps) {
  return (
    <AgoraRTMContext.Provider value={client}>
      {children}
    </AgoraRTMContext.Provider>
  );
}

function useOptionalRTM(client?: RTMClient | null): RTMClient | null {
  const clientFromContext = useContext(AgoraRTMContext);
  return client || clientFromContext;
}

export function useRtm(client?: RTMClient | null): RTMClient {
  const resolvedClient = useOptionalRTM(client);

  if (!resolvedClient) {
    throw new Error(
      'Agora RTM client not found. Should be wrapped in <RTMProvider value={client} />'
    );
  }

  return resolvedClient;
}
