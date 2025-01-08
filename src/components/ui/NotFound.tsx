import React from "react";

interface NotFoundProps {
  entity: "User" | "Form" | "Cohort";
  type?: "NotFound" | "NoData";
}

const NotFound: React.FC<NotFoundProps> = ({ entity, type = "NotFound" }) => {
  const message = `No ${entity.toLocaleLowerCase()} found!`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-12 text-center shadow-xl space-y-10 w-1/4">
        <h1 className="bg-primary-dark text-white py-3.5 px-6 text-xl flex items-center justify-center font-bold rounded-md
        ">
          Ooops!
        </h1>
        <p className="text-gray-600">
          {type === "NotFound" ? message : "No data"}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
