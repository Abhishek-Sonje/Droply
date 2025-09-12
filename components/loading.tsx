import { Spinner } from "@heroui/react";
import React from "react";
function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center  h-full text-white">
      {" "}
      <Spinner
        classNames={{ label: "text-white mt-4  " }}
        label={label}
        color="white"
        className=""
        // variant="simple"
        // labelColor="primary"
        size="lg"
      />
    </div>
  );
}

export default LoadingSpinner;
