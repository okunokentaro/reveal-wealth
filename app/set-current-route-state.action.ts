import {Injectable} from 'angular2/core';

import {Action} from './flux/action';
import {AppState, RouteState} from './app.store';

@Injectable()
export class SetCurrentRouteStateAction extends Action<AppState> {

  create(routeState: RouteState): this {
    this.createReducer((st: AppState) => {
      st.routeState = routeState;
      return Promise.resolve(st);
    });
    return this;
  }

}
