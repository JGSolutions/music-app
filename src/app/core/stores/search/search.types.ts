export interface ISearchState {
  searchValue: string;
  loading: boolean;
}

export const searchStateDefault: ISearchState = {
  searchValue: '',
  loading: false
};
