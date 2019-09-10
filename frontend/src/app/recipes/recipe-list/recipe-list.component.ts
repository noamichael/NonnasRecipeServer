import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeResponse, TypeOption } from '../../recipe.service';
import { Recipe } from '../../schema/recipe';
import { RecipeTableService } from '../recipe-table.service';
import { Subscription } from 'rxjs';
import { Table } from 'primeng/table';
import { Utils } from 'src/app/utils';
import { LazyLoadEvent } from 'primeng/api';

interface Filters {
  recipeName?: string,
  recipeType?: TypeOption | string,
  weightWatchers?: boolean
  page?: number
}
@Component({
  selector: 'nr-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: RecipeResponse<Recipe[]>

  filters: Filters = {}
  recipeTypes: TypeOption[]

  private doFilter: Function
  private firstLoad = true

  constructor(
    private recipeTableService: RecipeTableService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.recipes = data.recipes;
    })
    this.recipeTypes = this.recipeTableService.recipeTypes;
    this.route.params.subscribe(params => {
      this.filters.recipeName = params.recipeName;
      switch ('' + params.weightWatchers) {
        case 'true':
          this.filters.weightWatchers = true;
          break;
        case 'false':
          this.filters.weightWatchers = false;
          break;
        default:
          this.filters.weightWatchers = null;
      }
      this.filters.recipeType = this.recipeTypes.filter(rt => rt.value == params.recipeType)[0];
    });
    this.doFilter = Utils.debounce((field: string, dt: Table) => {
      dt.filter(this.filters[field], field, 'equals');
    }, 500);
  }

  ngOnDestroy() {

  }

  openRecipe(recipe?: Recipe) {
    const id = recipe ? recipe.id : 'new';
    const route = ['./', id];
    if (!recipe) {
      route.push('edit');
    }
    this.router.navigate(route, { relativeTo: this.route });
  }

  onRowSelect(recipe: Recipe) {
    this.openRecipe(recipe);
  }

  clearFilters(table: Table) {
    this.filters.recipeType = null;
    this.filters.recipeName = null;
    this.filters.weightWatchers = null;
    this.filters.page = 1;
    table.reset();
  }

  onFilterChange(field: string, dt: Table) {
    this.doFilter(field, dt);
  }

  onLazyLoad($event: LazyLoadEvent) {
    if (this.firstLoad) {
      this.firstLoad = false;
      return;
    }
    const filters: Filters = {
      page: ($event.first / $event.rows) + 1
    };
    if (this.filters.recipeName) {
      filters.recipeName = this.filters.recipeName;
    }
    if (this.filters.recipeType && this.filters.recipeType['value']) {
      filters.recipeType = this.filters.recipeType['value'];
    }
    if (this.filters.weightWatchers != null) {
      filters.weightWatchers = this.filters.weightWatchers;
    }

    this.router.navigate(['./', filters], { relativeTo: this.route });
  }

}