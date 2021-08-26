import { ISearchResults } from "models/search.model";

export interface ISearchState {
  searchValue: string;
  searchResults: ISearchResults;
  searchLoading: boolean;
  searchType: number;
}

export const searchStateDefault: ISearchState = {
  searchValue: '',
  searchResults: {} as ISearchResults,
  searchLoading: false,
  searchType: 0,
};
