import Cursor from "@/components/cursor/Cursor";
import { COLORS } from "@/constants";
import { useOthers } from "@/liveblocks.config";
import React from "react";

const LiveCursors = () => {
  const others = useOthers();
  return others.map(
    ({ connectionId, presence }) => {
      if (!presence?.cursor) return null;

      return (
        <Cursor
          key={connectionId}
          x={presence.cursor.x}
          y={presence.cursor.y}
          color={
            COLORS[connectionId % COLORS.length]
          }
          message={presence.message || ''}
        />
      );
    }
  );
};

export default LiveCursors;
