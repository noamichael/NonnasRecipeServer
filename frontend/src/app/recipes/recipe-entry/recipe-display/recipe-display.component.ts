import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/schema/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/recipe.service';

@Component({
  selector: 'nr-recipe-display',
  templateUrl: './recipe-display.component.html',
  styleUrls: ['./recipe-display.component.css']
})
export class RecipeDisplayComponent implements OnInit {

  recipe: Recipe

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.recipe = data.recipe.data;
    });
  }

  back(){
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  edit(){
    this.router.navigate(['./edit'], {relativeTo: this.route});
  }

  get gateway() {
    return this.recipeService.gateway;
  }


}
