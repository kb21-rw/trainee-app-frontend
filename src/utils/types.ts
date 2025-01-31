import { ReactNode } from "react"

/* eslint-disable no-unused-vars */
export interface IFormType {
  _id: string
  name: string
  description: string
  type: string
  questions: number
}

export interface User {
  _id: string
  userId: string
  name: string
  email: string
  role: UserRole
  coach: Omit<User, "coach">
}

export interface Cohort {
  _id: string
  name: string
  description: string
  isActive: boolean
  applicants: CohortParticipant[]
  trainees: CohortParticipant[]
  coaches: User[]
  forms: Form[]
  applicationForm: {
    applicationForm: {
      id: string
      stages: Stage[]
      startDate: string
      endDate: string
    }
  }
  stages: Stage[]
  trainingStartDate: string
}

export interface BaseForm {
  _id: string
  name: string
  description: string
  type: FormType.Applicant | FormType.Trainee
  questions: Question[]
}

export interface ExtraApplicantFormFields {
  type: FormType.Application
  startDate: string
  endDate: string
  stages: Stage[]
}

export interface ApplicationForm
  extends ExtraApplicantFormFields,
    Omit<BaseForm, "type"> {}

export type Form = BaseForm | ApplicationForm

export interface Question {
  _id: string
  prompt: string
  type: QuestionType
  required: boolean
  options: string[]
  responses: Response[]
}

export interface Response {
  _id: string
  user: User
  value: string | string[]
  questionId?: string
}

export interface Stage {
  id: string
  name: string
  description: string
  participantsCount: number
}

export interface Option {
  title: string
}

export interface TemplateQuestion {
  _id: string
  prompt: string
  responses: Response[]
  options: string[]
  type: QuestionType
  required: boolean
}
export interface UserResponseQuestion {
  _id: string
  prompt: string
  response: null | string | string[]
  options: string[]
  type: QuestionType
  required: boolean
}

export interface ResponseModalQuestion extends UserResponseQuestion {
  form: string
}

export interface ResponseCell {
  id: string
  [key: string]: null | string | string[]
}

export interface ApplicationFormResponse {
  questionId: string
  answer: string[]
}

export enum ButtonVariant {
  Primary = "Primary",
  Danger = "Danger",
}

export enum ButtonSize {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
}

export enum QuestionType {
  Text = "Text",
  SingleSelect = "SingleSelect",
  MultiSelect = "MultiSelect",
}

export enum UserRole {
  Admin = "Admin",
  Trainee = "Trainee",
  Coach = "Coach",
  Applicant = "Applicant",
  Prospect = "Prospect",
}

export type ApplicantDetails = {
  applied: boolean
  createdAt: string
  email: string
  googleId: string | null
  name: string
  password: string
  role: string
  updatedAt: string
  userId: string
  verified: boolean
  __v: number
  _id: string
}

export enum FormType {
  Applicant = "Applicant",
  Trainee = "Trainee",
  Application = "Application",
}

export enum ApplicationFormStatus {
  Open = "Open",
  Saved = "Saved",
  Submitted = "Submitted",
  NoApplication = "NoApplication",
  DeadlinePassed = "DeadlinePassed",
}

export interface IAlert {
  open: boolean
  type: "error" | "success"
  children: ReactNode
  displayDuration?: number
  onClose: () => void
}

export enum AlertType {
  Error = "Error",
  Success = "Success",
}

export type AlertData = Pick<IAlert, "type" | "displayDuration" | "children">

export enum Cookie {
  jwt = "jwt",
}

export enum AuthPage {
  Login = "Login",
  Signup = "Signup",
}

export interface CohortParticipant {
  id: string
  passedStages: string[]
  droppedStage: {
    id: string
    isConfirmed: boolean
  }
  feedbacks: { stageId: string; text: string }[]
}

export enum Decision {
  Rejected = "Rejected",
  Accepted = "Accepted",
}

export interface DecisionInfo {
  userId: string
  name: string
  email: string
  stage: string
  decision: Decision
}

export interface CreateUserDto {
  name: string
  email: string
  role: Omit<UserRole, UserRole.Applicant | UserRole.Trainee>
}

export enum ParticipantPhase {
  Rejected = "Rejected",
  Active = "Active",
  Completed = "Completed",
}

export interface UserRow {
  id: string
  name: string
  email: string
  coach: string
  coachName: string
  stage: string
  actions: ParticipantPhase
  [key: string]: string | string[]
}

export interface ResponseModalInfo {
  userId: string
  question: ResponseModalQuestion
}
