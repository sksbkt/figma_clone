"use client";
import { fabric } from 'fabric'
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import NavBar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectScaling, handleCanvasSelectionCreated, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { useEffect, useRef, useState } from "react";
import { ActiveElement, Attributes } from '@/types/type';
import { useMutation, useRedo, useStorage, useUndo } from '@/liveblocks.config';
import { defaultNavElement } from '@/constants';
import { handleDelete, handleKeyDown } from '@/lib/key-events';
import { handleImageUpload } from '@/lib/shapes';

export default function Page() {
  const undo = useUndo();
  const redo = useRedo();

  const [activeElement, setActiveElement] = useState<ActiveElement>({ name: "", value: "", icon: "" });
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: '',
    height: '',
    fontSize: '',
    fontWeight: '',
    fontFamily: '',
    fill: '#aabbcc',
    stroke: '#aabbcc',
  });


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isDrawing = useRef<boolean>(false);
  const isEditingRef = useRef<boolean>(false);


  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get('canvasObjects');
    if (!canvasObjects || canvasObjects.size == 0) return true;
    for (const [key, value] of Array.from(canvasObjects.entries())) {
      canvasObjects.delete(key);
    }
    canvasObjects.size === 0;
  }, []);
  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.set(objectId, shapeData);
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
      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;
        if (fabricRef.current)
          fabricRef.current.isDrawingMode = false;
        break;
      case 'delete':
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        break;

      default:
        break;
    }

    selectedShapeRef.current = elem?.value as string;
  }

  const canvasObjects = useStorage((root) => root.canvasObjects);




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
    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes
      });
    });
    canvas.on('object:scaling', (options) => {
      handleCanvasObjectScaling({ options, setElementAttributes })
    })
    canvas.on('object:modified', (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      })
    })



    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef.current })
    });
    window.addEventListener("keydown", (e) => {
      handleKeyDown({ e, canvas: fabricRef.current, undo, redo, syncShapeInStorage, deleteShapeFromStorage })
    })
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
      <NavBar activeElement={activeElement} handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e) => {
          e.stopPropagation();
          handleImageUpload({ file: e.target.files![0], canvas: fabricRef as any, shapeRef: shapeRef, syncShapeInStorage })
        }} />
      <section className="flex flex-row h-full">
        <LeftSidebar allShapes={Array.from(canvasObjects)} />
        <Live canvasRef={canvasRef} />
        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
}
