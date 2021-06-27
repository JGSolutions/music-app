
export interface IStreamUrl {
  url: string;
}
export interface IPlayerState {
  mixcloudAudio: IStreamUrl;
  loadingPlayer: boolean;
}

export const playerStateDefault: IPlayerState = {
  mixcloudAudio: {} as IStreamUrl,
  loadingPlayer: false,
};
