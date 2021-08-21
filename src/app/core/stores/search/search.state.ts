import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { SearchAction } from './search.actions';
import { ISearchState, searchStateDefault } from './search.types';

@State<ISearchState>({
  name: 'search',
  defaults: searchStateDefault,
})
@Injectable()
export class SearchState {
  constructor(private apiService: ApiService) {
  }

  @Selector()
  static searchLoading(state: ISearchState) {
    return state.searchLoading;
  }

  @Selector()
  static searchResults(state: ISearchState) {
    return state.searchResults;
  }

  @Action(SearchAction)
  _search(ctx: StateContext<ISearchState>, { value, uid }: SearchAction) {
    ctx.patchState({
      searchLoading: true
    });

    return this.apiService.search(value, uid).pipe(
      tap((data) => {
        ctx.patchState({
          searchResults: data,
          searchLoading: false
        });
      })
    )
  }

}
