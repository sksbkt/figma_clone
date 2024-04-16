import CursorChat from "@/components/cursor/CursorChat";
import LiveCursors from "@/components/cursor/LiveCursors";
import FlyingReaction from "@/components/reaction/FlyingReaction";
import ReactionSelector from "@/components/reaction/ReactionButton";
import useInterval from "@/hooks/useInterval";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
  useUpdateMyPresence
} from "@/liveblocks.config";
import {
  CursorMode,
  CursorState,
  Reaction,
  ReactionEvent
} from "@/types/type";
import React, {
  useCallback,
  useEffect,
  useState
} from "react";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}
const Live = ({ canvasRef }: Props) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] =
    useMyPresence() as any;
  const [cursorState, setCursorState] =
    useState<CursorState>({
      mode: CursorMode.Hidden
    });

  const [reaction, setReaction] = useState<
    Reaction[]
  >([]);

  const broadcast = useBroadcastEvent();

  useEventListener((eventData) => {
    const event =
      eventData.event as ReactionEvent;
    setReaction((reactions) => {
      return reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now()
        }
      ]);
    });
  });
  useInterval(() => {
    setReaction((reaction) =>
      reaction.filter(
        (r) => r.timestamp > Date.now() - 4000
      )
    );
  }, 1000);
  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReaction((reactions) => {
        return reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now()
          }
        ]);
      });
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction
      });
    }
  }, 100);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      if (
        cursor == null ||
        cursorState.mode !==
        CursorMode.ReactionSelector
      ) {
        const x =
          event.clientX -
          event.currentTarget.getBoundingClientRect()
            .x;
        const y =
          event.clientY -
          event.currentTarget.getBoundingClientRect()
            .y;
        updateMyPresence({ cursor: { x, y } });
      }
    },
    [cursor, cursorState.mode, updateMyPresence]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const x =
        event.clientX -
        event.currentTarget.getBoundingClientRect()
          .x;
      const y =
        event.clientY -
        event.currentTarget.getBoundingClientRect()
          .y;
      updateMyPresence({ cursor: { x, y } });

      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState.mode, updateMyPresence]
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      setCursorState({ mode: CursorMode.Hidden });
      updateMyPresence({
        cursor: null,
        message: null
      });
    },
    [updateMyPresence]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState.mode, setCursorState]
  );

  const setReactions = useCallback(
    (reaction: string) => {
      setCursorState({
        mode: CursorMode.Reaction,
        reaction,
        isPressed: false
      });
    },
    []
  );

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: ""
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({
          mode: CursorMode.Hidden
        });
      } else if (e.key === "e") {
        setCursorState({
          mode: CursorMode.ReactionSelector
        });
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(
        "keyup",
        onKeyUp
      );
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [updateMyPresence]);

  return (
    <div
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      className="h-[100vh] w-full text-center justify-center items-center flex"
    >
      <canvas ref={canvasRef}
        className="z-50" />
      {reaction.map((r) => (
        <FlyingReaction
          key={r.timestamp.toString()}
          x={r.point.x}
          y={r.point.y}
          value={r.value}
          timestamp={r.timestamp}
        />
      ))}
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursorState.mode ===
        CursorMode.ReactionSelector && (
          <ReactionSelector
            setReaction={setReactions}
          />
        )}
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
