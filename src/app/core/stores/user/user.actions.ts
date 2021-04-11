import { IUserType } from "./user.types";

export class LoginWithGoogleAction {
  static readonly type = '[User] Login With Google';
}

export class LogoutAction {
  static readonly type = '[User] Logout With Google';
}

export class SetUserAction {
  static readonly type = '[User] Set Action';
  constructor(public user: IUserType | null) {}
}
