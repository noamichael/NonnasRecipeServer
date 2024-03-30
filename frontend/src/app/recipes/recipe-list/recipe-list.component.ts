import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  RecipeResponse,
  RecipeService,
  TypeOption,
} from "../../recipe.service";
import { Recipe } from "../../schema/recipe";
import { RecipeTableService } from "../recipe-table.service";
import { LazyLoadEvent, SharedModule } from "primeng/api";
import { DataView, DataViewModule } from "primeng/dataview";
import { Subscription } from "rxjs";
import { UserService } from "../../shared/user.service";
import { Utils } from "../../utils";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { TriStateCheckboxModule } from "primeng/tristatecheckbox";
import { CheckboxModule } from "primeng/checkbox";
import { PageActionComponent } from "../../page-action/page-action.component";
import { DialogModule } from "primeng/dialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { PopoverKeyboardDirective } from "../../shared/popover-keyboard.directive";

interface Filters {
  recipeName?: string;
  recipeType?: TypeOption | string;
  weightWatchers?: boolean | null;
  page?: number;
  userId?: TypeOption | string;
}

@Component({
  standalone: true,
  selector: "nr-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TriStateCheckboxModule,
    CheckboxModule,
    PageActionComponent,
    DialogModule,
    InputSwitchModule,
    PopoverKeyboardDirective,
    SharedModule
  ]
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: RecipeResponse<Recipe[]>;

  filters: Filters = {};
  recipeTypes!: TypeOption[];
  recipeOwners!: TypeOption[];
  showFilters!: boolean;
  mobile = false;
  loggedIn: boolean = false;

  private doFilter!: Function;
  private firstLoad = true;
  private mediaQuery!: MediaQueryList;
  private subscriptions!: Subscription[];
  private resetScroll = false;
  private lastLoadEvent!: LazyLoadEvent

  onMediaMatch = (e: MediaQueryListEvent) => {
    this.mobile = e.matches;
    if (!e.matches) {
      this.showFilters = false;
    }
  };

  constructor(
    private recipeTableService: RecipeTableService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private recipeService: RecipeService,
  ) {}

  ngOnInit() {
    this.mediaQuery = window.matchMedia("(max-width: 750px)");
    this.mobile = this.mediaQuery.matches;

    this.mediaQuery.addEventListener("change", this.onMediaMatch);

    this.route.data.subscribe((data) => {
      this.recipes = data["recipes"];
    });
    this.recipeTypes = this.recipeTableService.recipeTypes;
    this.recipeOwners = this.recipeTableService.recipeOwners;
    this.route.params.subscribe((params) => {
      this.filters.recipeName = params["recipeName"];
      switch ("" + params["weightWatchers"]) {
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
        rt.value == params["recipeType"]
      )[0];
      this.filters.userId =
        this.recipeOwners.filter((rt) => rt.value == params["userId"])[0];

      if (this.resetScroll) {
        this.resetScroll = false;
        // Update reset the scroll bar on page change. I do this here
        // instead of in the app.component because I don't want to
        // reset scrolling when navigating backwards
        if (document.scrollingElement){
          document.scrollingElement.scrollTop = 0;
        }
      }
    });
    this.doFilter = Utils.debounce((field: string, dt: DataView) => {
      this.onLazyLoad({ first: 0, rows: this.recipes.count });
    }, 500);

    this.subscriptions = [
      this.userService.$auth.subscribe(() => {
        this.loggedIn = this.userService.isSignedIn();
      }),
    ];
  }

  ngOnDestroy() {
    this.mediaQuery.removeEventListener("change", this.onMediaMatch);
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  openRecipe(recipe?: Recipe) {
    const id = recipe ? recipe.id : "new";
    const route = ["./", id];
    if (!recipe) {
      route.push("0", "edit");
    } else if (recipe.recipeName) {
      route.push(this.recipeService.cleanRecipeName(recipe.recipeName));
    }

    this.router.navigate(route, { relativeTo: this.route });
  }

  onRowSelect(recipe: Recipe) {
    this.openRecipe(recipe);
  }

  clearFilters(table: DataView) {
    this.filters.recipeType = "";
    this.filters.recipeName = "";
    this.filters.userId = "";
    this.filters.weightWatchers = null;
    this.filters.page = 1;
    this.onLazyLoad({ first: 0, rows: this.recipes.count });
  }

  onFilterChange(field: string, dt: DataView) {
    this.doFilter(field, dt);
  }


  get canWriteRecipes() {
    return this.userService.canWriteRecipes();
  }

  onLazyLoad($event: LazyLoadEvent) {
    if (this.firstLoad) {
      this.firstLoad = false;
      return;
    }

    // Only reset the scroll if we've paginated
    if (this.lastLoadEvent && $event.first != this.lastLoadEvent.first) {
      this.resetScroll = true;
    }

    const filters: Filters = {
      page: Math.round(($event.first || 1) / ($event.rows || 1)) + 1,
    };
    if (this.filters.recipeName) {
      filters.recipeName = this.filters.recipeName;
    }
    if (this.filters.recipeType && (this.filters.recipeType as TypeOption).value) {
      filters.recipeType = (this.filters.recipeType as TypeOption).value;
    }
    if (this.filters.weightWatchers) {
      filters.weightWatchers = this.filters.weightWatchers;
    }

    if (this.filters.userId && (this.filters.userId as TypeOption).value) {
      filters.userId = (this.filters.userId as TypeOption).value
    }
    
    this.lastLoadEvent = $event;

    this.router.navigate(["./", filters], { relativeTo: this.route });
  }
}
