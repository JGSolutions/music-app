export interface IPlayerlistState {
  loadingPlaylist: boolean;
  playlistData: IPlaylist[];
  playlistTrack: any;
}

export const playerlistStateDefault: IPlayerlistState = {
  loadingPlaylist: false,
  playlistData: [],
  playlistTrack: {}
};

export interface IPlaylist {
  id?: string;
  uid: string;
  createdDate: Date;
  playlistName: string;
}
