import { useEffect, useRef } from 'react';

import { IRtmClient } from '../IAgoraRtmClient';
import { IRtmClientEvent } from '../extensions/IAgoraRtmClientExtension';

type Disposer = () => void;
type Nullable<T> = T | null | undefined;

function listen<EventType extends keyof IRtmClientEvent>(
  listenable: IRtmClient,
  event: EventType,
  listener: IRtmClientEvent[EventType]
): Disposer;
function listen<EventType extends keyof IRtmClientEvent>(
  listenable: IRtmClient,
  event: EventType,
  listener: IRtmClientEvent[EventType]
) {
  listenable.addEventListener(event, listener);
  return () => listenable.removeEventListener(event, listener);
}

export function useRtmEvent<EventType extends keyof IRtmClientEvent>(
  client: Nullable<IRtmClient>,
  event: EventType,
  listener: Nullable<(...args: any[]) => void>
) {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (client) {
      return listen(client, event, (...args: any[]) => {
        if (listenerRef.current) {
          listenerRef.current(...args);
        }
      });
    }
  }, [event, client]);
}
