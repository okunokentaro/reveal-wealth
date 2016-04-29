import {ChangeDetectorRef} from 'angular2/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import 'rxjs/operator/debounceTime';

import {Dispatcher} from './dispatcher';

type Listener<ST extends State> = (readOnlyCurrentState: ST) => void;

export abstract class State {}

export class Store<ST extends State> {

  private complete = new ReplaySubject<ST>();

  constructor(protected currentStateRef: ST,
              private Dispatcher: Dispatcher<ST>) {
    this.Dispatcher.subscribe((reducer) => {
      reducer(Object.assign({}, this.currentStateRef), this.currentStateRef).then((next) => {
        this.complete.next(next);
      });
    });
  }

  /**
   * @param cdRef
   * @param listener
   * @return Function - disposer
   */
  onComplete(cdRef: ChangeDetectorRef, listener: Listener<ST>): Function {
    const disposer = this.complete
      .scan((acc, val) => Object.assign({}, acc, val))
      .debounceTime(1) // This is because it does not call listener() in quick succession.
      .subscribe((curr: ST) => {
        listener(Object.assign({}, curr) as ST); // Argument of the listener() is read-only.
        cdRef.detectChanges();
      });
    return () => disposer.unsubscribe();
  }

}
