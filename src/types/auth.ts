// types/auth.ts
export interface DecodedToken {
  user_id: string;
  school_id: string;
  school_code: string;
  role: "Student" | "Teacher" | "Admin";
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  school_name: string;
  school_image: string;
  iat: number;
  exp: number;
}

export interface LoginFormData {
  username: string;
  password: string;
  school_code: string;
  agreeToTerms: boolean;
}
