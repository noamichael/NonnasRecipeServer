import { TestBed } from '@angular/core/testing';

import { RecipeTableService } from './recipe-table.service';

describe('RecipeTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecipeTableService = TestBed.get(RecipeTableService);
    expect(service).toBeTruthy();
  });
});
