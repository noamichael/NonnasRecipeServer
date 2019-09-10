
INSERT INTO Recipe (recipeType, recipeName, servingSize)
VALUES ("Dinner", "Mashed Potatoes", 5);

INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription)
VALUES (1, 1, "Buy some potatoes");

INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription)
VALUES (1, 2, "Boil the potatoes till tender");

INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription)
VALUES (1, 3, "Mash the potatoes");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (1, "5 pounds of potatoes");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (1, "1 stick of butter");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (1, "1 tbl salt");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (1, "1 cup of milk");


INSERT INTO Recipe (recipeType, recipeName, servingSize)
VALUES ("Soup", "Babci's Beet Soup", 12);

INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription)
VALUES (2, 1, "Clean the Beets");

INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription)
VALUES (2, 2, "Boil the beets");

INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription)
VALUES (2, 3, "Blend the mixture");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (2, "3 nice size beets");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (2, "1 gallon of water");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (2, "3 tbl dill");

INSERT INTO Ingredient (recipeId, ingredientDescription)
VALUES (2, "1 cup of extra love");