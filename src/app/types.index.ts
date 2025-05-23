import { JwtPayload } from "jsonwebtoken";

export type Project = {
  title: string;
  description: string;
  imgSrc?: string;
  link?: string;
};

export type Testimonial = {
  index: number;
  author: string;
  role?: string;
  quote: string;
  imgSrc?: string;
};

export interface DecodedToken extends JwtPayload {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  isSecured: boolean;
  exp?: number; // from jwt and not from schema
  iat?: number; // from jwt and not from schema
}
