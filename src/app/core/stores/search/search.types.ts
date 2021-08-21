export interface ISearchState {
  searchValue: string;
  searchResults: any;
  loading: boolean;
}

export const searchStateDefault: ISearchState = {
  searchValue: '',
  searchResults: [],
  loading: false
};
