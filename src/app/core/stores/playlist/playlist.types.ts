export interface IPlayerlistState {
  loadingPlaylist: boolean;
  playlistData: IPlaylist[];
}

export const playerlistStateDefault: IPlayerlistState = {
  loadingPlaylist: false,
  playlistData: []
};

export interface IPlaylist {
  id?: string;
  uid: string;
  createdDate: Date;
  playlistName: string;
}
