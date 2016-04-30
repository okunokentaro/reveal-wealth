import {Injectable} from 'angular2/core';
import {Action} from '../walts-proto';

import {AppState} from '../app.store';
import {BindableMoneyTransaction} from '../domain/application/money-transaction/bindable-money-transaction';
import {CategoryRepository} from '../domain/application/category/category-repository';

@Injectable()
export class ChangeCategoryNameAction extends Action<AppState> {

  constructor(private CategoryRepository: CategoryRepository) {
    super();
  }

  create(entity: BindableMoneyTransaction, newName: string): this {
    this.createReducer(async (curr: AppState, next: AppState) => {
      this.CategoryRepository.update(entity.categoryId, newName);
      return Promise.resolve(next);
    });
    return this;
  }

}