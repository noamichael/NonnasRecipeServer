import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  RecipeResponse,
  RecipeService,
  TypeOption,
} from "../../recipe.service";
import { Recipe } from "../../schema/recipe";
import { RecipeTableService } from "../recipe-table.service";
import { Utils } from "src/app/utils";
import { LazyLoadEvent } from "primeng/api";
import { DataView } from "primeng/dataview";
import { UserService } from "src/app/shared/user.service";

interface Filters {
  recipeName?: string;
  recipeType?: TypeOption | string;
  weightWatchers?: boolean;
  page?: number;
  mine?: boolean;
}

@Component({
  selector: "nr-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: RecipeResponse<Recipe[]>;

  filters: Filters = {};
  recipeTypes: TypeOption[];

  private doFilter: Function;
  private firstLoad = true;

  constructor(
    private recipeTableService: RecipeTableService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.recipes = data.recipes;
    });
    this.recipeTypes = this.recipeTableService.recipeTypes;
    this.route.params.subscribe((params) => {
      this.filters.recipeName = params.recipeName;
      switch ("" + params.weightWatchers) {
        case "true":
          this.filters.weightWatchers = true;
          break;
        case "false":
          this.filters.weightWatchers = false;
          break;
        default:
          this.filters.weightWatchers = null;
      }
      this.filters.recipeType = this.recipeTypes.filter((rt) =>
        rt.value == params.recipeType
      )[0];
      this.filters.mine = params.mine;
    });
    this.doFilter = Utils.debounce((field: string, dt: DataView) => {
      this.onLazyLoad({ first: 0, rows: this.recipes.count });
    }, 500);
  }

  ngOnDestroy() {
  }

  openRecipe(recipe?: Recipe) {
    const id = recipe ? recipe.id : "new";
    const route = ["./", id];
    if (!recipe) {
      route.push("edit");
    }
    this.router.navigate(route, { relativeTo: this.route });
  }

  onRowSelect(recipe: Recipe) {
    this.openRecipe(recipe);
  }

  clearFilters(table: DataView) {
    this.filters.recipeType = null;
    this.filters.recipeName = null;
    this.filters.weightWatchers = null;
    this.filters.page = 1;
    this.onLazyLoad({ first: 0, rows: this.recipes.count });
  }

  onFilterChange(field: string, dt: DataView) {
    this.doFilter(field, dt);
  }

  onLazyLoad($event: LazyLoadEvent) {
    if (this.firstLoad) {
      this.firstLoad = false;
      return;
    }
    const filters: Filters = {
      page: ($event.first / $event.rows) + 1,
    };
    if (this.filters.recipeName) {
      filters.recipeName = this.filters.recipeName;
    }
    if (this.filters.recipeType && this.filters.recipeType["value"]) {
      filters.recipeType = this.filters.recipeType["value"];
    }
    if (this.filters.weightWatchers != null) {
      filters.weightWatchers = this.filters.weightWatchers;
    }

    if (this.filters.mine) {
      filters.mine = this.filters.mine;
    }

    this.router.navigate(["./", filters], { relativeTo: this.route });
  }

  get loggedIn() {
    return this.userService.isSignedIn();
  }
}
