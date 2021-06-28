import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { HistoryService } from 'src/app/services/history.service';
import { AddHistoryAction } from './history.actions';
import { historyStateDefault, IHistoryState } from './history.types';

@State<IHistoryState>({
  name: 'history',
  defaults: historyStateDefault,
})
@Injectable()
export class HistoryState {
  constructor(private _historyService: HistoryService) { }

  // @Selector()
  // static loadingPlayer(state: IHistoryState) {
  //   return state.loadingPlayer;
  // }

  @Action(AddHistoryAction)
  _addHistory(ctx: StateContext<IHistoryState>, { uid, track }: AddHistoryAction) {
    return this._historyService.addToHistory(uid, track);
  }

}
