/* eslint-disable no-unused-vars */
export interface IFormType {
  _id: string;
  name: string;
  description: string;
  type: string;
  questions: number;
}

export interface User {
  _id?: string;
  name: string;
  coach?: Coach;
}

export interface Coach {
  _id?: string;
  name: string;
}

export interface CreateCoach {
  name: string;
  email: string;
  password: string;
}
export interface CreateCohort {
  name: string;
  description: string;
  stages: Stage[];
}

export interface Stage {
  name: string;
  description: string;
}

export interface Response {
  _id?: string;
  text: string | null;
  user: User;
}

export interface Option {
  title: string;
}

export interface Question {
  _id?: string;
  prompt: string;
  responses: Response[];
  options: string[];
  type: QuestionType;
}

export interface Form {
  _id?: string;
  title: string;
  description: string;
  questions: Question[];
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
export interface Cohort {
  name: string;
  description: string;
  isActive: boolean;
  stages: number;
  applicants: number;
  trainees: number;
  coaches: number;
  forms: number;
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
