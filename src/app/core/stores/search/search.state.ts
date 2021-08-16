import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { ISearchState, searchStateDefault } from './search.types';

@State<ISearchState>({
  name: 'search',
  defaults: searchStateDefault,
})
@Injectable()
export class SearchState {
  constructor() {
  }

  // @Selector()
  // static connectedServices(state: IConnectedServicesState) {
  //   return state.servicesType;
  // }

  // @Action(ConnectedServicesAction)
  // _connectedServices(ctx: StateContext<IConnectedServicesState>, { uid }: ConnectedServicesAction) {
  //   return this.connectedServices.connectedServices(uid).pipe(
  //     tap((data) => {
  //       ctx.patchState({
  //         servicesType: data
  //       });
  //     })
  //   )
  // }

}
