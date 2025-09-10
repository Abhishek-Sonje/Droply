import { Spinner } from "@heroui/react";
import React from "react";
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center  h-full text-white">
      {" "}
      <Spinner
        classNames={{ label: "text-white mt-4" }}
        label="fetching files"
        color="white"
        variant="simple"
        labelColor="primary"
        size="lg"
      />
    </div>
  );
}

export default LoadingSpinner;
