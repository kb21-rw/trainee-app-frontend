import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table"
import {
  Response,
  Form,
  QuestionType,
  Cookie,
  TemplateQuestion,
} from "../../utils/types"

import { useGetOverviewQuery } from "../../features/user/backendApi"
import Loader from "../../components/ui/Loader"
import { useCookies } from "react-cookie"
const OverView = () => {
  const [cookies] = useCookies([Cookie.jwt])
  const { data, isFetching, isError } = useGetOverviewQuery({
    jwt: cookies.jwt,
  })

  const [, setIsModalOpen] = useState(false)
  const [, setModalData] = useState({
    formTitle: "",
    question: "",
    questionId: "",
    userId: "",
    response: "",
    type: "",
    questionType: "",
    options: [] as string[],
    checkedOption: "",
  })

  if (isFetching) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (isError) {
    return <Loader />
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>
  }

  const traineeMap = new Map()

  data.forEach((form: Form) => {
    form.questions.forEach((question: TemplateQuestion) => {
      question.responses.forEach((response: Response) => {
        if (response.user) {
          if (!traineeMap.has(response.user._id)) {
            traineeMap.set(response.user._id, {
              name: response.user.name,
              coach: response.user.coach?.name,
              id: response.user._id,
              responses: {},
            })
          }

          const traineeInfo = traineeMap.get(response.user._id)
          traineeInfo.responses[`${form._id}-${question._id}`] =
            response ?? "No response"
        }
      })
    })
  })

  return (
    <div className="py-20 overflow-x-auto">
      <Table className="min-w-full border-collapse border border-black text-black">
        <TableHeader>
          <TableRow>
            <TableHead
              scope="col"
              rowSpan={3}
              className="border border-black px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider"
            >
              Name
            </TableHead>
            <TableHead
              scope="col"
              rowSpan={2}
              className="border border-black px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider"
            >
              Coach
            </TableHead>
            {data.map((form, index) => (
              <TableHead
                key={form._id}
                scope="col"
                colSpan={form.questions.length}
                className={`px-6 py-3 text-center text-sm font-extrabold uppercase tracking-wider bg-primary-dark/30 ${
                  index !== data.length - 1 ? "border-r border-black" : ""
                }`}
              >
                {form.title}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            {data.flatMap((form) =>
              form.questions.map((question: TemplateQuestion) => (
                <TableHead
                  key={question._id}
                  scope="col"
                  className="border border-black px-6 py-3 text-left text-sm font-extrabold uppercase tracking-wider max-w-md overflow-auto whitespace-nowrap"
                >
                  {question.prompt}
                </TableHead>
              )),
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-300">
          {Array.from(traineeMap.values()).map((trainee) => (
            <TableRow key={trainee.name}>
              <TableCell className="border border-black p-2 whitespace-nowrap w-16">
                {trainee.name ?? "No name"}
              </TableCell>
              <TableCell className="border border-black p-2 whitespace-nowrap w-16">
                {trainee.coach ?? "No coach"}
              </TableCell>
              {data.flatMap((form) =>
                form.questions.map((question: TemplateQuestion) => (
                  <TableCell
                    key={`${form._id}-${question._id}`}
                    className="border border-black p-2 whitespace-nowrap w-16 max-w-md overflow-hidden text-ellipsis"
                    onClick={() => {
                      setIsModalOpen(true)
                      setModalData({
                        formTitle: form.title,
                        question: question.prompt,
                        questionId: question._id ?? "",
                        response:
                          trainee.responses[`${form._id}-${question._id}`],
                        userId: trainee.id,
                        type: trainee.type,
                        questionType:
                          question.options.length > 0
                            ? QuestionType.SingleSelect
                            : QuestionType.Text,
                        options: question.options,
                        checkedOption: trainee.responses[
                          `${form._id}-${question._id}`
                        ]
                          ? trainee.responses[`${form._id}-${question._id}`]
                          : "",
                      })
                    }}
                  >
                    {trainee.responses[`${form._id}-${question._id}`] ??
                      "No response"}
                  </TableCell>
                )),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OverView
