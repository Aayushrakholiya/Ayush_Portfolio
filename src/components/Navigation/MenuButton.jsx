import { forwardRef } from "react";

const MenuButton = forwardRef(function MenuButton(
  { isBlack = false },
  ref
) {
  const lineColor = isBlack
    ? "#000000"
    : "#ffffff";

  return (
    <div
      ref={ref}
      className="
        pointer-events-none
        absolute right-0 top-0 z-30
        flex h-14 w-full
        items-center justify-end pr-10
      "
    >
      <div className="flex flex-col items-end gap-2">
        <span
          className="
            menu-button-line
            block h-[2px] w-14
          "
          style={{
            backgroundColor: lineColor,
          }}
        />

        <span
          className="
            menu-button-line
            block h-[2px] w-9
          "
          style={{
            backgroundColor: lineColor,
          }}
        />
      </div>
    </div>
  );
});

export default MenuButton;