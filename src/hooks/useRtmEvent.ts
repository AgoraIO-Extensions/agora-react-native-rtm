import { useEffect, useRef } from 'react';

import { RTMClient } from '../api/RTMClient';
import { RTMClientEventMap } from '../api/RTMEvents';

type Disposer = () => void;
type Nullable<T> = T | null | undefined;

function listen<EventType extends keyof RTMClientEventMap>(
  listenable: RTMClient,
  event: EventType,
  listener: RTMClientEventMap[EventType]
): Disposer;
function listen<EventType extends keyof RTMClientEventMap>(
  listenable: RTMClient,
  event: EventType,
  listener: RTMClientEventMap[EventType]
) {
  listenable.addEventListener(event, listener);
  return () => listenable.removeEventListener(event, listener);
}

export function useRtmEvent<EventType extends keyof RTMClientEventMap>(
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
    } else {
      return () => {
        throw new Error('client is null');
      };
    }
  }, [event, client]);
}
