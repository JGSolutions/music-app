export interface IUserType {
    uid?: string;
    email: string;
    displayName: string;
    photoURL: string;
}

export interface UserStateModel {
  user: IUserType | null;
  loaded: boolean;
}
