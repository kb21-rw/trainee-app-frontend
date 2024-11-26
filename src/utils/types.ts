import { ReactNode } from "react";

/* eslint-disable no-unused-vars */
export interface IFormType {
  _id: string;
  name: string;
  description: string;
  type: string;
  questions: number;
}

export interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  coach: Omit<User, "coach">;
}

export interface Cohort {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  applicants: CohortParticipant[];
  trainees: CohortParticipant[];
  coaches: User[];
  forms: Form[];
  applicationForm: {
    applicationForm: {
      id: string;
      stages: Stage[];
      startDate: string;
      endDate: string;
    };
  };
  stages: Stage[];
  trainingStartDate: string;
}

export interface Form {
  _id: string;
  name: string;
  description: string;
  type: FormType;
  questions: Question[];
}
export interface Question {
  _id: string;
  prompt: string;
  type: QuestionType;
  required: boolean;
  options: string[];
  responses: Response[];
}

export interface Response {
  _id: string;
  user: User;
  value: string | string[];
}

export interface CreateCoach {
  name: string;
  email: string;
  password: string;
}
export interface Stage {
  id: string;
  name: string;
  description: string;
}

export interface Option {
  title: string;
}

export interface TemplateQuestion {
  _id: string;
  prompt: string;
  responses: Response[];
  options: string[];
  type: QuestionType;
  required: boolean;
}
export interface UserResponseQuestion {
  _id: string;
  prompt: string;
  response: null | string | string[];
  options: string[];
  type: QuestionType;
  required: boolean;
}

export interface ApplicationFormResponse {
  questionId: string;
  answer: string[];
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
  applied: boolean;
  createdAt: string;
  email: string;
  googleId: string | null;
  name: string;
  password: string;
  role: string;
  updatedAt: string;
  userId: string;
  verified: boolean;
  __v: number;
  _id: string;
};

export enum ApplicantDecision {
  Accepted = "Accepted",
  Rejected = "Rejected",
}

export enum FormType {
  Applicant = "Applicant",
  Trainee = "Trainee",
  Application = "Application",
}

export interface MenuItemType {
  label: string;
  type?: FormType;
  link?: string;
}

export interface ApplicationFormType {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  stages: { name: string; description: string }[] | [];
}

export enum ApplicationFormStatus {
  OPEN = "Open",
  CLOSED = "Closed",
  DEADLINE_PASSED = "DeadlinePassed",
  NO_APPLICATION = "NoApplication",
}

export type ApplicationStatus = {
  isOpen: boolean;
  status: ApplicationFormStatus;
};

export type ApplicationForm = {
  id: string;
  name: string;
  description: string;
  type: string;
  questions: any[];
  startDate: string | Date;
  endDate: string | Date;
};

export interface IAlert {
  open: boolean;
  type: "error" | "success";
  children: ReactNode;
  displayDuration?: number;
  onClose: () => void;
}

export enum AlertType {
  Error = "Error",
  Success = "Success",
}

export type AlertData = Pick<IAlert, "type" | "displayDuration" | "children">;

export enum Cookie {
  jwt = "jwt",
}

export enum AuthPage {
  Login = "Login",
  Signup = "Signup",
}

export interface CohortParticipant {
  id: string;
  passedStages: string[];
  droppedStage: {
    id: string;
    isConfirmed: boolean;
  };
  feedbacks: { stageId: string; text: string }[];
}
