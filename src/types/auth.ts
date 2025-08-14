export interface DecodedToken {
  user_id: string;
  school_id: string;
  school_code: string;
  role: string;
  role_ids: number[];
  role_names: string[];
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  school_name: string;
  school_image: string;
  is_approved: boolean;
  iat: number;
  exp: number;
}

export interface LoginFormData {
  username: string;
  password: string;
  school_code: string;
  agreeToTerms: boolean;
}
