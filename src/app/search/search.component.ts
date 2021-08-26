import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'models/artist.types';
import { ISearchResults } from 'models/search.model';
import { Observable, Subject } from 'rxjs';
import { SearchTypeAction } from '../core/stores/search/search.actions';
import { SearchState } from '../core/stores/search/search.state';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SearchState.searchResults) searchResults$!: Observable<ISearchResults>;
  @Select(SearchState.searchType) searchType$!: Observable<number>;

  private destroy$ = new Subject<boolean>();

  constructor(private router: Router, private store: Store) { }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedTabChange(evt: any) {
    this.store.dispatch(new SearchTypeAction(evt));
  }

  public selectArtist(item: IArtists) {
    this.router.navigate(["/", "artist-songs"], {
      queryParams: {
        platform: item.platform,
        id: item.id,
        username: item.username
      }
    });
  }
}
