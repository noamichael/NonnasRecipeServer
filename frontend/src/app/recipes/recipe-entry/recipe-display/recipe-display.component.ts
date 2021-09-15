import { Component, OnInit } from "@angular/core";
import { Recipe } from "src/app/schema/recipe";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeService } from "src/app/recipe.service";
import { UserService } from "src/app/shared/user.service";

@Component({
  selector: "nr-recipe-display",
  templateUrl: "./recipe-display.component.html",
  styleUrls: ["./recipe-display.component.scss"],
})
export class RecipeDisplayComponent implements OnInit {
  recipe: Recipe;
  ownsRecipe: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private recipeService: RecipeService,
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.recipe = data.recipe.data;
      this.ownsRecipe = this.recipeService.ownsRecipe(
        this.userService.$auth.value,
        this.recipe,
      );
    });
  }

  back() {
    this.router.navigate(["../../"], { relativeTo: this.route });
  }

  edit() {
    this.router.navigate(["./edit"], { relativeTo: this.route });
  }

  get loggedIn() {
    return this.userService.isSignedIn();
  }
}
