"use client";
import { fabric } from 'fabric'
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import NavBar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleCanvasObjectModified, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { useEffect, useRef, useState } from "react";
import { ActiveElement } from '@/types/type';
import { useMutation, useStorage } from '@/liveblocks.config';
import { defaultNavElement } from '@/constants';
import { handleDelete } from '@/lib/key-events';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef<boolean>(false);

  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');
  const activeObjectRef = useRef<fabric.Object | null>(null);

  const [activeElement, setActiveElement] = useState<ActiveElement>({ name: "", value: "", icon: "" });

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get('canvasObjects');
    if (!canvasObjects || canvasObjects.size == 0) return true;
    for (const [key, value] of Array.from(canvasObjects.entries())) {
      canvasObjects.delete(key);
    }
    canvasObjects.size === 0;
  }, []);

  const deleteShapeFromStorage = useMutation(({ storage }, objectId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(objectId);
  }, []);
  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    switch (elem?.value) {
      case 'reset':
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;
      case 'delete':
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        break;

      default:
        break;
    }

    selectedShapeRef.current = elem?.value as string;
  }

  const canvasObjects = useStorage((root) => root.canvasObjects)

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.set(objectId, shapeData);
  }, []);


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
    canvas.on("mouse:move", (options) => {
      handleCanvasMouseMove({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        syncShapeInStorage
      });
      // *due to performance issue cant translate object is realtime
      // handleCanvasObjectModified({
      //   options,
      //   syncShapeInStorage,
      // })
    });
    canvas.on("mouse:up", (options) => {
      handleCanvasMouseUp({
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef
      });
    });
    canvas.on('object:modified', (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      })
    })



    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef.current })
    });
    return () => {
      canvas.dispose();
    }
  }, []);
  useEffect(() => {
    renderCanvas(
      { fabricRef, canvasObjects, activeObjectRef }
    )
    return () => {
    };
  }, [canvasObjects]);
  return (
    <main className="h-screen overflow-hidden">
      <NavBar activeElement={activeElement} handleActiveElement={handleActiveElement} />
      <section className="flex flex-row h-full">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  );
}
