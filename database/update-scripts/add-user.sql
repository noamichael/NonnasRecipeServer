USE NonnasRecipes;

CREATE TABLE IF NOT EXISTS RecipeUser
(
	id INT NOT NULL AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL,
	fullName VARCHAR(255) NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO RecipeUser (email, fullName)
VALUES ("lindamkucinski@gmail.com", "Linda Kucinski");

ALTER TABLE Recipe
    ADD COLUMN userId INT NOT NULL DEFAULT 1,
    ADD CONSTRAINT FK_USER_ID FOREIGN KEY (userId) 
    REFERENCES RecipeUser(id); 