import React, { useState } from "react";
import { useGetFormQuery } from "../../features/user/apiSlice";
import Loader from "../../components/ui/Loader";
import { useNavigate, useParams } from "react-router-dom";
import EditForm from "../../components/ui/EditForm";
import Back from "../../assets/BackIcon";
import QuestionCard from "../../components/ui/QuestionCard";
import { getJWT } from "../../utils/helper";
import { Question } from "../../utils/types";

const SingleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jwt: string = getJWT();
  const { data, isFetching, error } = useGetFormQuery({ id: id || "", jwt });

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
    <div className="py-12 max-w-5xl mx-auto mt-10">
      <button onClick={() => navigate("/forms")}>
        <Back />
      </button>

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
