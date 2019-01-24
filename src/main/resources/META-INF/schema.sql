DROP DATABASE NonnasRecipes;

CREATE DATABASE IF NOT EXISTS NonnasRecipes;

USE NonnasRecipes;

CREATE TABLE Recipe 
(  
	id INT NOT NULL AUTO_INCREMENT,
	recipeType  VARCHAR(50) NOT NULL,
	recipeName  VARCHAR(255) NOT NULL,
	cookTime  VARCHAR (25) NULL,
	servingSize  VARCHAR(255) NULL,
        weightWatchers BOOLEAN NULL DEFAULT FALSE,
        points INT NULL,
        PRIMARY KEY (id)
) ;

 CREATE TABLE RecipeStep 
 (  
	recipeId INT NOT NULL, 
	stepOrder INT NOT NULL, 
	stepDescription VARCHAR(255), 
	PRIMARY KEY(recipeId, stepOrder), 
	FOREIGN KEY (recipeId) REFERENCES Recipe(id) 
); 

 CREATE TABLE Ingredient 
( 
 	recipeId INT NOT NULL, 
	ingredientDescription VARCHAR(255), 
	FOREIGN KEY (recipeId) REFERENCES Recipe(id) 
);

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

ALTER TABLE Recipe ADD COLUMN weightWatchers BOOLEAN NULL DEFAULT FALSE;
ALTER TABLE Recipe ADD COLUMN points INT NULL;

ALTER TABLE Recipe MODIFY COLUMN servingSize VARCHAR(255) NULL;