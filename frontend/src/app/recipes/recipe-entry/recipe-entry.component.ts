import {
  Component,
  Injectable,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CanActivate, CanDeactivate } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import {
  RecipeResponse,
  RecipeService,
  TypeOption,
} from "../../recipe.service";
import { ConfirmationService } from "primeng/api";
import { Recipe } from "../../schema/recipe";
import { Ingredient } from "../../schema/ingredient";
import { RecipeStep } from "../../schema/recipe-step";
import { Utils } from "../../utils";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { of, Subscription } from "rxjs";
import { RecipeTableService } from "../recipe-table.service";
import { UserService } from "../../shared/user.service";
import { CardModule } from "primeng/card";
import { PageActionComponent } from "../../page-action/page-action.component";
import { PanelModule } from "primeng/panel";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CheckboxModule } from "primeng/checkbox";
import { FocusDirective } from "../../shared/focus.directive";
import { FieldsetModule } from "primeng/fieldset";
import { CommonModule } from "@angular/common";
import { PopoverKeyboardDirective } from "../../shared/popover-keyboard.directive";

@Component({
  standalone: true,
  selector: "nr-recipe-entry",
  templateUrl: "./recipe-entry.component.html",
  styleUrls: ["./recipe-entry.component.scss"],
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    PageActionComponent,
    PanelModule,
    DropdownModule,
    ConfirmDialogModule,
    CheckboxModule,
    FocusDirective,
    FieldsetModule,
    PopoverKeyboardDirective
  ]
})
export class RecipeEntryComponent implements OnInit, OnDestroy {
  recipeTypes: TypeOption[] = [];
  recipeType: TypeOption | null = null;

  subscriptions: Subscription[] = [];

  ingredientFocusIndex = -1;
  stepFocusIndex = -1;

  recipe!: Recipe;
  ownsRecipe: boolean = false;

  @ViewChild(NgForm, { static: true })
  form!: NgForm;

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private recipeTableService: RecipeTableService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscriptions = [
      this.userService.$auth.subscribe(() => {
        this.setOwnsRecipe();
      }),
      this.route.data.subscribe((data) => {
        this.recipe = data['recipe'].data;
        if (!this.recipe.ingredients.length) {
          this.recipe.ingredients.push({});
        }
        if (!this.recipe.steps.length) {
          this.recipe.steps.push({});
        }
        this.recipeTypes = this.recipeTableService.recipeTypes;

        if (this.recipe.recipeType) {
          this.recipeType = this.recipeTypes.filter((t) =>
            t.value === this.recipe.recipeType
          )[0];
        } else {
          this.recipeType = null;
        }

        this.setOwnsRecipe();
      }),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  back() {
    if (this.recipe.id) {
      this.goToDisplayScreen();
    } else {
      this.goToListScreen();
    }
  }

  goToDisplayScreen() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  goToListScreen() {
    this.router.navigate(["../../../"], { relativeTo: this.route });
  }

  saveRecipe() {
    if (!this.ownsRecipe) {
      return;
    }

    const recipeForm: Recipe = {
      id: this.recipe.id,
      recipeName: this.recipe.recipeName,
      recipeType: this.recipeType?.value,
      cookTime: this.recipe.cookTime,
      servingSize: this.recipe.servingSize,
      weightWatchers: this.recipe.weightWatchers,
      points: this.recipe.points,
      steps: this.recipe.steps.slice().filter((s) => !!s.stepDescription),
      ingredients: this.recipe.ingredients.slice().filter((i) =>
        !!i.ingredientDescription
      ),
    };

    this.recipeService.saveRecipe(recipeForm).subscribe((saved) => {
      this.form.form.markAsPristine();
      this.router.navigate([
        "/",
        "recipes",
        saved.data.id,
        this.recipeService.cleanRecipeName(recipeForm.recipeName || ''),
      ]);
    });
  }

  deleteRecipe() {
    const recipe = this.recipe;
    this.confirmationService.confirm({
      message:
        `Are you sure you want to delete the recipe ${recipe.recipeName ||
        ""}?`,
      accept: () => {
        if (recipe.id) {
          this.recipeService.deleteRecipe(recipe).subscribe((r) => {
            this.goToListScreen();
          });
        } else {
          this.goToListScreen();
        }
      },
    });
  }

  resetRecipe(form: NgForm) {
    this.confirmationService.confirm({
      message: `Are you sure you want to reset the form?`,
      accept: () => {
        this.recipe = { ingredients: [{}], steps: [{}] };
        this.recipeType = null;
        this.router.navigate(["../../../", "new", "0", "edit"], {
          relativeTo: this.route,
        });
        form.form.markAsPristine();
      },
    });
  }

  addIngredient(index: number) {
    setTimeout(() => {
      const newIndex = index + 1;
      this.recipe.ingredients = this.recipe.ingredients.slice();
      this.recipe.ingredients.splice(newIndex, 0, {
        ingredientDescription: "",
      });
      this.ingredientFocusIndex = newIndex;
    });
  }

  trackByIndex(number: number, item: any) {
    return number;
  }

  removeIngredient(ingredient: Ingredient) {
    this.recipe.ingredients.splice(
      this.recipe.ingredients.indexOf(ingredient),
      1,
    );
  }

  addStep(index: number) {
    setTimeout(() => {
      const newIndex = index + 1;
      this.recipe.steps = this.recipe.steps.slice();
      this.recipe.steps.splice(newIndex, 0, {});
      this.stepFocusIndex = newIndex;
    });
  }

  removeStep(step: RecipeStep) {
    this.recipe.steps.splice(this.recipe.steps.indexOf(step), 1);
  }

  incrementStep(step: RecipeStep) {
    const currentIndex = this.recipe.steps.indexOf(step);
    let newIndex = currentIndex + 1;
    if (newIndex >= this.recipe.steps.length) {
      newIndex = 0;
    }
    Utils.moveInArray(this.recipe.steps, currentIndex, newIndex);
  }

  decrementStep(step: RecipeStep) {
    const currentIndex = this.recipe.steps.indexOf(step);
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.recipe.steps.length - 1;
    }
    Utils.moveInArray(this.recipe.steps, currentIndex, newIndex);
  }

  onWeightWatchersChange($event: boolean) {
    if (!$event) {
      this.recipe.points = 0;
    }
  }

  canDeactivate() {
    if (this.form.pristine) {
      return Promise.resolve(true);
    }
    return new Promise<boolean>((resolve, reject) => {
      this.confirmationService.confirm({
        message:
          `You have unsaved changed. Are you sure you want to leave, Mom?`,
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  private setOwnsRecipe() {
    if (!this.recipe) return;
    this.ownsRecipe = this.recipeService.ownsRecipe(
      this.userService.$auth.value,
      this.recipe,
    );
  }
}

@Injectable({
  providedIn: "***REMOVED***"
})
export class RecipeResolver implements Resolve<RecipeResponse<Recipe>> {
  constructor(
    private recipeService: RecipeService,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    if (route.params['id'] === "new") {
      return of({
        data: { ingredients: [{}], steps: [{}] },
      });
    }
    return this.recipeService.getRecipe(route.params['id']);
  }
}

@Injectable({
  providedIn: "***REMOVED***"
})
export class CanDeactivateEntry implements CanDeactivate<RecipeEntryComponent> {
  constructor() { }

  canDeactivate(
    component: RecipeEntryComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ): Promise<boolean> {
    return component.canDeactivate();
  }
}

@Injectable({
  providedIn: "***REMOVED***"
})
export class CanActivateEntry implements CanActivate {
  constructor(
    private userService: UserService,
    private recipeSerivce: RecipeService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.userService.isSignedIn() || !this.userService.canWriteRecipes()) {
      this.router.navigate(["recipes", route.params['id'], "view"]);
      return false;
    }
    return true;
  }
}
