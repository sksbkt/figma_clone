"use client";

import { ReactNode, useEffect, useState } from "react";
import { RoomProvider } from "../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";
import Loader from "@/components/new_components/Loader";

export function Room({
  children
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loader />;
  }

  return (
    <RoomProvider
      id="my-room"
      initialPresence={{
        cursor: null,
        cursorColor: null,
        editingText: null
      }}
      initialStorage={{ canvasObjects: new LiveMap() }}
    >
      <ClientSideSuspense
        fallback={<Loader />}
      >
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
