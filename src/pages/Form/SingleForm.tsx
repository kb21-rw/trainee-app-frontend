import React, { useState } from "react";
import { useGetFormQuery } from "../../features/user/backendApi";
import Loader from "../../components/ui/Loader";
import { useParams } from "react-router-dom";
import EditForm from "../../components/ui/EditForm";
import QuestionCard from "../../components/ui/QuestionCard";
import { Cookie, Question } from "../../utils/types";
import { useCookies } from "react-cookie";

const SingleForm = () => {
  const [cookies] = useCookies([Cookie.jwt]);
  const { id } = useParams<{ id: string }>();
  const { data, isFetching, error } = useGetFormQuery({
    id: id || "",
    jwt: cookies.jwt,
  });

  const [activeQuestion, setActiveQuestion] = useState<string>("");

  if (isFetching) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <p>Failed to load form details. Please try again later.</p>
      </div>
    );
  }

  const { name, description, type, questionIds: questions = [] } = data;

  return (
    <div className="py-12 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <EditForm
          name={name}
          description={description}
          id={id || ""}
          type={type}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
        />
        <div className="flex flex-col gap-4">
          {questions.map((question: Question) => (
            <QuestionCard
              key={question._id}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
              question={question}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleForm;
