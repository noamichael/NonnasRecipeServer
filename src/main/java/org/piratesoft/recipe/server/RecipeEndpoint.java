package org.piratesoft.recipe.server;

import java.util.List;
import java.util.Optional;
import org.piratesoft.recipe.server.schema.Recipe;
import org.piratesoft.recipe.server.sql.MySql;
import static spark.Spark.*;

/**
 *
 * @author kucin
 */
public class RecipeEndpoint {

    public static void setupEndpoints() {
        before((req, res) -> {
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin,");
            res.header("Access-Control-Allow-Credentials", "true");
        });

        get("/recipes", (req, res) -> {
            MySql sql = new MySql();
            List<Recipe> recipes = sql.getRecipes(1, 25);
            sql.destroy();
            return recipes;
        }, new JsonTransformer());

        get("/recipes/:id", (req, res) -> {
            MySql sql = new MySql();
            int recipeId = Integer.valueOf(req.params(":id"));
            Optional<Recipe> recipeOptional = sql.getRecipe(recipeId);
            sql.destroy();
            if (!recipeOptional.isPresent()) {
                res.status(404);
                return "Recipe not found";
            }            
            return recipeOptional.get();
        }, new JsonTransformer());
    }
}
