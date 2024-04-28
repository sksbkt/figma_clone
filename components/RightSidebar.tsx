import Color from "@/components/settings/Color";
import Dimensions from "@/components/settings/Dimensions";
import Export from "@/components/settings/Export";
import Text from "@/components/settings/Text";
import { modifyShape } from "@/lib/shapes";
import { RightSidebarProps } from "@/types/type";
import React, { useRef } from "react";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  activeObjectRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current)
      isEditingRef.current = true;
    setElementAttributes((prev) => ({
      ...prev,
      [property]: value
    }))

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage
    })

  }

  return (
    <section className="z-20 flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky right-0 h-full max-sm:hidden select-none">
      <h3 className="px-5 pt-4 text-xs uppercase">
        Design
      </h3>
      <span className="text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-grey-200 pb-4">Make changes to canvas as you like</span>
      <Dimensions
        width={elementAttributes.width}
        height={elementAttributes.height}
        isEditingRef={isEditingRef}
        handleInputChange={handleInputChange}
      />
      <Text
        fontFamily={elementAttributes.fontFamily}
        fontSize={elementAttributes.fontSize}
        fontWeight={elementAttributes.fontWeight}
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={colorInputRef}
        attribute={elementAttributes.fill}
        handleInputChange={handleInputChange}
        // TODO: adding opacity 
        placeholder="color"
        attributeType="fill"
      />
      <Color
        inputRef={strokeInputRef}
        attribute={elementAttributes.fill}
        handleInputChange={handleInputChange}
        placeholder="stroke"
        attributeType="stroke"
      />
      <Export />
    </section>
  );
};

export default RightSidebar;
