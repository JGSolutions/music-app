export interface IPlayerlistState {
  loadingPlaylist: boolean;
}

export const playerlistStateDefault: IPlayerlistState = {
  loadingPlaylist: false,
};

export interface IPlaylist {
  uid: string;
  createdDate: Date;
  playlistName: string;
}
