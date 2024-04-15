import CursorSVG from "@/public/assets/CursorSVG";
import { CursorChatProps, CursorMode } from "@/types/type";
import React from "react";


const CursorChat = ({ cursor, cursorState, setCursorState, updateMyPresence }: CursorChatProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value,
    });
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && cursorState.mode === CursorMode.Chat) {
      setCursorState({
        mode: CursorMode.Chat,
        previousMessage: cursorState.message,
        message: ''
      });
    } else if (e.key === "Escape") {
      setCursorState({ mode: CursorMode.Hidden });
    }
  }

  return (<div className="absolute top-0 left-0" style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }}>
    {cursorState.mode === CursorMode.Chat && (<>
      <CursorSVG color="#000" />
      <div
        className="absolute top-5 left-2 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]"
        // ? like this it wont trigger event listener for key e 
        onKeyUp={(e) => e.stopPropagation()}
      >
        {cursorState.previousMessage && (<div>{cursorState.previousMessage}</div>)}
        <input className="z-10 w-60 border-none bg-transparent text-white placeholder-blue-300 
      // ?fix to remove chrome highlight
      focus:outline-none
      " autoFocus={true}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={cursorState.previousMessage ? '' : 'Type a message...'}
          value={cursorState.message}
          maxLength={50}
        />
      </div>
    </>)}
  </div>);
};

export default CursorChat;
