"use client";
import { fabric } from 'fabric'
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import NavBar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";
import { useEffect, useRef } from "react";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef<boolean>(false);

  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });
    window.addEventListener("resize", () => {
      handleResize({ fabricRef })
    })
  }, []);
  return (
    <main className="h-screen overflow-hidden">
      <NavBar />
      <section className="flex flex-row h-full">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  );
}
