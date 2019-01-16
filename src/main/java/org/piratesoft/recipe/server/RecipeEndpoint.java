package org.piratesoft.recipe.server;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.Arrays;
import java.util.Optional;
import org.piratesoft.recipe.server.schema.Recipe;
import org.piratesoft.recipe.server.schema.Recipe.RecipeType;
import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.sql.MySql;
import spark.Request;
import spark.Response;
import spark.Route;
import static spark.Spark.*;

/**
 *
 * @author kucin
 */
public class RecipeEndpoint {

    public static void setupEndpoints() {
        
        final Gson gson = new GsonBuilder().disableHtmlEscaping().create();
        
        before((req, res) -> {
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin,");
            res.header("Access-Control-Allow-Credentials", "true");
        });
        
        //GET methods
        
        get("/recipe-types", (req, res) -> {
            return new RecipeResponse<>(Arrays.asList(RecipeType.values()));
        }, new JsonTransformer());

        get("/recipes", sqlRoute((req, res, sql) -> {
            int page = Integer.valueOf(req.queryParamOrDefault("page", "1"));
            int count = Integer.valueOf(req.queryParamOrDefault("count", "1000"));
            return sql.getRecipes(page, count);
        }), new JsonTransformer());

        get("/recipes/:id", sqlRoute((req, res, sql) -> {
            int recipeId = Integer.valueOf(req.params(":id"));
            Optional<Recipe> recipeOptional = sql.getRecipe(recipeId);
            if (!recipeOptional.isPresent()) {
                res.status(404);
                return "Recipe not found";
            }
            return new RecipeResponse<>(recipeOptional.get());
        }), new JsonTransformer());
        
        //Save Methods
        
        post("/recipes", sqlRoute((req, res, sql) -> {
            Recipe recipe = gson.fromJson(req.body(), Recipe.class);
            int id = sql.saveRecipe(recipe);
            if(id == -1){
                res.status(500);
                return "Could not save recipe. Unknown SQL error";
            }
            Recipe justId = new Recipe();
            justId.setId(id);
            return new RecipeResponse<>(justId);
        }));
    }
    
    

    static Route sqlRoute(SQLEndpoint endpoint) {
        return (req, res) -> {
            MySql sql = new MySql();
            try {
                return endpoint.handle(req, res, sql);
            } finally {
                sql.destroy();
            }
        };
    }

    @FunctionalInterface
    interface SQLEndpoint {
        Object handle(Request req, Response res, MySql sql) throws Exception;
    }

}
