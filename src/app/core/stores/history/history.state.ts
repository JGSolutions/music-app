import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { HistoryService } from 'src/app/services/history.service';
import { AddHistoryAction, HistoryListAction } from './history.actions';
import { historyStateDefault, IHistoryState } from './history.types';

@State<IHistoryState>({
  name: 'history',
  defaults: historyStateDefault,
})
@Injectable()
export class HistoryState {
  constructor(private _historyService: HistoryService) { }

  @Selector()
  static historyList(state: IHistoryState) {
    return state.histroyTracks;
  }

  @Action(AddHistoryAction)
  _addHistory(ctx: StateContext<IHistoryState>, { uid, track }: AddHistoryAction) {
    return this._historyService.addToHistory(uid, track);
  }

  @Action(HistoryListAction)
  _historyListAction(ctx: StateContext<IHistoryState>, { uid }: HistoryListAction) {
    return this._historyService.getHistory(uid).pipe(tap((e) => console.log(e)));
  }
}
