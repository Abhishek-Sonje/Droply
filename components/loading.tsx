import { Spinner } from "@heroui/react";
import React from "react";
function LoadingSpinner({ label,color }: { label: string,color:string }) {
  return (
    <div className="flex items-center justify-center  h-full text-white">
      {" "}
      <Spinner
        classNames={{ label: `text-[${color}] mt-4 font-semibold`  }}
        label={label}
        color="current"
        className={`text-[${color}]`}
        // variant="simple"
         
        size="lg"
      />
    </div>
  );
}

export default LoadingSpinner;
