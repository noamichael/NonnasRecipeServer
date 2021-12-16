USE NonnasRecipes;

ALTER TABLE RecipeUser
    ADD COLUMN userRole VARCHAR(32) NOT NULL DEFAULT "readOnly";

UPDATE RecipeUser SET userRole = "admin" WHERE email IN ('michaelkucinski@gmail.com', "lindamkucinski@gmail.com");