import { CommentsOverlay } from "@/components/comments/CommentsOverlay";
import { ClientSideSuspense } from "@liveblocks/react";
import React from "react";

export const Comments = () => {
    return (<ClientSideSuspense fallback={null}>
        {() => <CommentsOverlay />}
    </ClientSideSuspense>);
};

