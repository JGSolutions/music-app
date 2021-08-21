import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { IArtists } from 'models/artist.types';
import { ISearchResults } from 'models/search.model';
import { Observable, Subject } from 'rxjs';
import { SelectArtistAction } from '../core/stores/artists/artists.actions';
import { SearchState } from '../core/stores/search/search.state';
import { UserState } from '../core/stores/user/user.state';
import { IUserType } from '../core/stores/user/user.types';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Select(UserState.userState) user$!: Observable<IUserType>;
  @Select(SearchState.searchResults) searchResults$!: Observable<ISearchResults>;

  public selectedTab = 0;
  private destroy$ = new Subject<boolean>();

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectedTabChange(evt: any) {
    this.selectedTab = evt;
  }

  public selectArtist(item: IArtists) {
    this.store.dispatch(new SelectArtistAction([item])).subscribe(() => {
      this.router.navigate(["/", "artist", item.name]);
    });
  }
}
