import { useEffect, useRef } from 'react';

import { IRtmClientEvent, RTMClient } from '../api/RTMClient';

type Disposer = () => void;
type Nullable<T> = T | null | undefined;

function listen<EventType extends keyof IRtmClientEvent>(
  listenable: RTMClient,
  event: EventType,
  listener: IRtmClientEvent[EventType]
): Disposer;
function listen<EventType extends keyof IRtmClientEvent>(
  listenable: RTMClient,
  event: EventType,
  listener: IRtmClientEvent[EventType]
) {
  listenable.addEventListener(event, listener);
  return () => listenable.removeEventListener(event, listener);
}

export function useRtmEvent<EventType extends keyof IRtmClientEvent>(
  client: Nullable<RTMClient>,
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
