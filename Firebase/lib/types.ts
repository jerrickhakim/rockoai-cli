export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}
