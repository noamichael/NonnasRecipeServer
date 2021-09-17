package org.piratesoft.recipe.server;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.piratesoft.recipe.server.schema.Recipe;
import org.piratesoft.recipe.server.schema.Recipe.RecipeType;
import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.schema.RecipeUser;
import org.piratesoft.recipe.server.sql.MySql;
import org.piratesoft.recipe.server.sql.MySqlInstance;
import org.piratesoft.recipe.server.sql.repository.RecipeRepository;

import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.ResponseTransformer;
import spark.Route;
import spark.Service;

/**
 *
 * @author kucin
 */
public class RecipeEndpoint {

    public static void setupEndpoints(Service service) {

        final Gson gson = new GsonBuilder().disableHtmlEscaping().create();

        service.options("/*", RecipeEndpoint::options);

        service.before(RecipeEndpoint::before);

        // PUBLIC methods
        final ResponseTransformer JSON = new JsonTransformer();

        service.get("/recipe-types", (req, res) -> {
            return new RecipeResponse<>(Arrays.asList(RecipeType.values()));
        }, JSON);

        service.get("/recipes", sqlRoute((req, res, sql) -> {
            RecipeRepository repository = new RecipeRepository(sql);
            Optional<RecipeUser> reqUser = AuthEndpoint.lookupUser(req, sql);
            int page = Integer.valueOf(req.queryParamOrDefault("page", "1"));
            int count = Integer.valueOf(req.queryParamOrDefault("count", "1000"));
            return repository.getRecipes(page, count, reqUser.orElse(null), paramsToMap(req.queryMap()));
        }), JSON);

        service.get("/recipes/owners", sqlRoute((req, res, sql) -> {
            RecipeRepository repository = new RecipeRepository(sql);
            return repository.getRecipeOwners();
        }), JSON);

        service.get("/recipes/:id", sqlRoute((req, res, sql) -> {
            RecipeRepository repository = new RecipeRepository(sql);
            int recipeId = Integer.valueOf(req.params(":id"));
            Optional<Recipe> recipeOptional = repository.getRecipe(recipeId);
            if (!recipeOptional.isPresent()) {
                res.status(404);
                return "Recipe not found";
            }
            return new RecipeResponse<>(recipeOptional.get());
        }), JSON);

        // Private method
        service.post("/recipes", sqlRoute((req, res, sql) -> {

            Optional<RecipeUser> reqUser = AuthEndpoint.lookupUser(req, sql);

            if (!reqUser.isPresent()) {
                res.status(401);
                return unauthorized("You need to be signed in to save recipes");
            }
            RecipeUser user = reqUser.get();

            if (!user.canWrite()) {
                res.status(401);
                return unauthorized("You are currently not approved to save recipes");
            }

            RecipeRepository repository = new RecipeRepository(sql);


            Recipe recipe = gson.fromJson(req.body(), Recipe.class);

            Integer id = recipe.getId();

            if (id != null) {
                Optional<Recipe> oldRecipe = repository.getRecipe(id);

                if (oldRecipe.isPresent() && oldRecipe.get().getUserId() != user.id) {
                    res.status(401);
                    return unauthorized("You can only save recipes that belong to you.");
                }
            }

            // Mark this recipe belongs to the current user
            recipe.setUserId(user.id);

            id = repository.saveRecipe(recipe);
            if (id == -1) {
                res.status(500);
                return "Could not save recipe. Unknown SQL error";
            }
            Recipe justId = new Recipe();
            justId.setId(id);
            return new RecipeResponse<>(justId);
        }), JSON);

        service.delete("/recipes/:id", sqlRoute((req, res, sql) -> {
            Optional<RecipeUser> reqUser = AuthEndpoint.lookupUser(req, sql);

            if (!reqUser.isPresent()) {
                res.status(401);
                return unauthorized("You need to be signed in to save recipes");
            }

            RecipeRepository repository = new RecipeRepository(sql);

            RecipeUser user = reqUser.get();
            int recipeId = Integer.valueOf(req.params(":id"));

            Optional<Recipe> oldRecipe = repository.getRecipe(recipeId);

            if (oldRecipe.isPresent() && oldRecipe.get().getUserId() != user.id) {
                res.status(401);
                return unauthorized("You can only delete recipes that belong to you.");
            }

            int id = repository.deleteRecipe(recipeId);
            if (id == -1) {
                res.status(500);
                return "Could not delete recipe. Unknown SQL error";
            }
            res.status(200);
            return null;
        }), JSON);
    }

    static Object options(Request request, Response response) {
        String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
        if (accessControlRequestHeaders != null) {
            response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
        }

        String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
        if (accessControlRequestMethod != null) {
            response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
        }

        return "OK";
    }

    static void before(Request request, Response response) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Request-Method", "GET,PUT,POST,DELETE,OPTIONS");
        response.header("Access-Control-Allow-Headers", "*");
        response.header("Access-Control-Allow-Credentials", "true");
    }

    static Route sqlRoute(SQLEndpoint endpoint) {
        return (req, res) -> {
            MySql sql = MySqlInstance.get();
            return endpoint.handle(req, res, sql);
        };
    }

    static Map<String, List<String>> paramsToMap(QueryParamsMap map) {
        Map<String, List<String>> result = new HashMap<>();

        map.toMap().forEach((key, values) -> {
            result.put(key, Arrays.asList(values));
        });

        return result;
    }

    @FunctionalInterface
    interface SQLEndpoint {

        Object handle(Request req, Response res, MySql sql) throws Exception;
    }

    static RecipeResponse<Object> unauthorized(String message) {
        RecipeResponse<Object> response = new RecipeResponse<>();

        response.setError(new RecipeResponse.RecipeError("401", message));

        return response;
    }

}
