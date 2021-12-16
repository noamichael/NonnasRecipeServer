import { Component, OnDestroy, OnInit } from "@angular/core";
import { Recipe } from "src/app/schema/recipe";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeService } from "src/app/recipe.service";
import { UserService } from "src/app/shared/user.service";
import { Subscription } from "rxjs";

@Component({
  selector: "nr-recipe-display",
  templateUrl: "./recipe-display.component.html",
  styleUrls: ["./recipe-display.component.scss"],
})
export class RecipeDisplayComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  ownsRecipe: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private recipeService: RecipeService,
  ) {}

  ngOnInit() {
    this.subscriptions = [
      this.route.data.subscribe((data) => {
        this.recipe = data.recipe.data;
        this.setOwnsRecipes();
      }),
      this.userService.$auth.subscribe((user) => {
        this.setOwnsRecipes();
      }),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  back() {
    this.router.navigate(["../../"], { relativeTo: this.route });
  }

  edit() {
    this.router.navigate(["./edit"], { relativeTo: this.route });
  }

  private setOwnsRecipes() {
    this.ownsRecipe = this.recipeService.ownsRecipe(
      this.userService.$auth.value,
      this.recipe,
    );
  }

  get loggedIn() {
    return this.userService.isSignedIn();
  }
}
