export interface IUserProfile {
  _id: string;
  showContentPage: boolean;
  pending: boolean;
  isKeyAdmin: boolean;
  isAdmin: boolean;
  active: boolean;
  isEmailSent: boolean;
  lastName: string;
  firstName: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
  savedChart: [];
}
