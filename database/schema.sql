USE NonnasRecipes;

CREATE TABLE IF NOT EXISTS Recipe 
(  
	id INT NOT NULL AUTO_INCREMENT,
	recipeType  VARCHAR(50) NOT NULL,
	recipeName  VARCHAR(255) NOT NULL,
	cookTime  VARCHAR (25) NULL,
	servingSize  VARCHAR(255) NULL,
	weightWatchers BOOLEAN NULL DEFAULT FALSE,
	points INT NULL,
	PRIMARY KEY (id)
);

 CREATE TABLE IF NOT EXISTS RecipeStep 
 (  
	recipeId INT NOT NULL, 
	stepOrder INT NOT NULL, 
	stepDescription VARCHAR(255), 
	PRIMARY KEY(recipeId, stepOrder), 
	FOREIGN KEY (recipeId) REFERENCES Recipe(id) 
); 

 CREATE TABLE IF NOT EXISTS Ingredient 
( 
 	recipeId INT NOT NULL, 
	ingredientDescription VARCHAR(255), 
	FOREIGN KEY (recipeId) REFERENCES Recipe(id) 
);