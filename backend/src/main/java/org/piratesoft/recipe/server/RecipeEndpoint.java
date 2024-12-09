package org.piratesoft.recipe.server;

import java.util.Arrays;
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

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.Handler;

/**
 *
 * @author kucin
 */
public class RecipeEndpoint {

    public static void setupEndpoints(Javalin service) {

        service.options("/*", RecipeEndpoint::options);

        service.before(RecipeEndpoint::before);

        // PUBLIC methods

        service.get("/recipe-types", (ctx) -> {
            ctx.json(new RecipeResponse<>(Arrays.asList(RecipeType.values())));
        });

        service.get("/recipes", sqlRoute((ctx, sql) -> {
            RecipeRepository repository = new RecipeRepository(sql);
            Optional<RecipeUser> reqUser = AuthEndpoint.lookupUser(ctx, sql);
            Map<String, List<String>> queryParams = ctx.queryParamMap();
            int page = Integer.valueOf(queryParams.getOrDefault("page", Arrays.asList(("1"))).getFirst());
            int count = Integer.valueOf(queryParams.getOrDefault("count", Arrays.asList("1000")).getFirst());
            ctx.json(repository.getRecipes(page, count, reqUser.orElse(null), queryParams));
        }));

        service.get("/recipes/owners", sqlRoute((ctx, sql) -> {
            RecipeRepository repository = new RecipeRepository(sql);
            ctx.json(repository.getRecipeOwners());
        }));

        service.get("/recipes/{id}", sqlRoute((ctx, sql) -> {
            RecipeRepository repository = new RecipeRepository(sql);
            int recipeId = Integer.valueOf(ctx.pathParam("id"));
            Optional<Recipe> recipeOptional = repository.getRecipe(recipeId);
            if (!recipeOptional.isPresent()) {
                ctx.status(404);
                ctx.result("Recipe not found");
                return;
            }
            ctx.json(new RecipeResponse<>(recipeOptional.get()));
        }));

        // Private method
        service.post("/recipes", sqlRoute((ctx, sql) -> {

            Optional<RecipeUser> reqUser = AuthEndpoint.lookupUser(ctx, sql);

            if (!reqUser.isPresent()) {
                ctx.status(401);
                ctx.json(unauthorized("You need to be signed in to save recipes"));
                return;
            }
            RecipeUser user = reqUser.get();

            if (!user.canWrite()) {
                ctx.status(403);
                ctx.json(unauthorized("You are currently not approved to save recipes"));
                return;
            }

            RecipeRepository repository = new RecipeRepository(sql);

            Recipe recipe = ctx.bodyAsClass(Recipe.class);

            Integer id = recipe.getId();
            boolean shouldSetId = true;

            if (id != null) {
                Recipe previousRecipe = repository.getRecipe(id).orElse(null);

                if (previousRecipe != null) {
                    // If you don't own the recipe AND you aren't an admin, fail
                    if (previousRecipe.getUserId() != user.id && !user.isAdmin()) {
                        ctx.status(401);
                        ctx.json(unauthorized("You can only save recipes that belong to you."));
                        return;
                    }

                    // no need to set id since there is a previous record
                    shouldSetId = false;
                    recipe.setUserId(previousRecipe.getId());
                }
            }

            // Mark this recipe belongs to the current user
            if (shouldSetId) {
                recipe.setUserId(user.id);
            }

            id = repository.saveRecipe(recipe);
            if (id == -1) {
                ctx.status(500);
                ctx.result("Could not save recipe. Unknown SQL error");
                return;
            }
            Recipe justId = new Recipe();
            justId.setId(id);
            ctx.json(new RecipeResponse<>(justId));
        }));

        service.delete("/recipes/{id}", sqlRoute((ctx, sql) -> {
            Optional<RecipeUser> reqUser = AuthEndpoint.lookupUser(ctx, sql);

            if (!reqUser.isPresent()) {
                ctx.status(401);
                ctx.json(unauthorized("You need to be signed in to save recipes"));
                return;
            }

            RecipeRepository repository = new RecipeRepository(sql);

            RecipeUser user = reqUser.get();
            int recipeId = Integer.valueOf(ctx.pathParam("id"));

            Recipe previousRecipe = repository.getRecipe(recipeId).orElse(null);

            if (!user.canWrite()) {
                ctx.status(403);
                ctx.json(unauthorized("You are not authorized to delete recipes"));
                return;
            }

            if (previousRecipe != null) {
                // If you don't own the recipe AND you aren't an admin, fail
                if (previousRecipe.getUserId() != user.id && !user.isAdmin()) {
                    ctx.status(403);
                    ctx.json(unauthorized("You can only delete recipes that belong to you."));
                    return;
                }
            } else {
                ctx.status(404);
                ctx.json(new RecipeResponse.RecipeError("404", "Not found"));
                return;
            }

            int id = repository.deleteRecipe(recipeId);
            if (id == -1) {
                ctx.status(500);
                ctx.result("Could not delete recipe. Unknown SQL error");
                return;
            }
            ctx.status(200);
        }));
    }

    static void options(Context ctx) {
        String accessControlRequestHeaders = ctx.header("Access-Control-Request-Headers");
        if (accessControlRequestHeaders != null) {
            ctx.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
        }

        String accessControlRequestMethod = ctx.header("Access-Control-Request-Method");
        if (accessControlRequestMethod != null) {
            ctx.header("Access-Control-Allow-Methods", accessControlRequestMethod);
        }

        ctx.result("OK");
    }

    static void before(Context ctx) {
        ctx.header("Access-Control-Allow-Origin", "*");
        ctx.header("Access-Control-Request-Method", "GET,PUT,POST,DELETE,OPTIONS");
        ctx.header("Access-Control-Allow-Headers", "*");
        ctx.header("Access-Control-Allow-Credentials", "true");
    }

    static Handler sqlRoute(SQLEndpoint endpoint) {
        return (ctx) -> {
            MySql sql = MySqlInstance.get();
            endpoint.handle(ctx, sql);
        };
    }

    @FunctionalInterface
    interface SQLEndpoint {
        void handle(Context ctx, MySql sql) throws Exception;
    }

    static RecipeResponse<Object> unauthorized(String message) {
        RecipeResponse<Object> response = new RecipeResponse<>();

        response.setError(new RecipeResponse.RecipeError("401", message));

        return response;
    }

}
