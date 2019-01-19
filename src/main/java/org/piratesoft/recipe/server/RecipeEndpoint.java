package org.piratesoft.recipe.server;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.ServletOutputStream;
import org.piratesoft.recipe.server.schema.Recipe;
import org.piratesoft.recipe.server.schema.Recipe.RecipeType;
import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.sql.MySql;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.ResponseTransformer;
import spark.Route;
import static spark.Spark.*;

/**
 *
 * @author kucin
 */
public class RecipeEndpoint {

    public static void setupEndpoints() {

        final Gson gson = new GsonBuilder().disableHtmlEscaping().create();

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Request-Method", "GET,PUT,POST,DELETE,OPTIONS");
            response.header("Access-Control-Allow-Headers", "*");
            response.header("Access-Control-Allow-Credentials", "true");
        });

        //GET methods
        final ResponseTransformer JSON = new JsonTransformer();

        get("/recipe-types", (req, res) -> {
            return new RecipeResponse<>(Arrays.asList(RecipeType.values()));
        }, JSON);

        get("/nonna", RecipeEndpoint::serveFiles);
        get("/nonna/*", RecipeEndpoint::serveFiles);

        get("/recipes", sqlRoute((req, res, sql) -> {
            int page = Integer.valueOf(req.queryParamOrDefault("page", "1"));
            int count = Integer.valueOf(req.queryParamOrDefault("count", "1000"));
            return sql.getRecipes(page, count, paramsToMap(req.queryMap()));
        }), JSON);

        get("/recipes/:id", sqlRoute((req, res, sql) -> {
            int recipeId = Integer.valueOf(req.params(":id"));
            Optional<Recipe> recipeOptional = sql.getRecipe(recipeId);
            if (!recipeOptional.isPresent()) {
                res.status(404);
                return "Recipe not found";
            }
            return new RecipeResponse<>(recipeOptional.get());
        }), JSON);

        //Save Methods
        post("/recipes", sqlRoute((req, res, sql) -> {
            Recipe recipe = gson.fromJson(req.body(), Recipe.class);
            int id = sql.saveRecipe(recipe);
            if (id == -1) {
                res.status(500);
                return "Could not save recipe. Unknown SQL error";
            }
            Recipe justId = new Recipe();
            justId.setId(id);
            return new RecipeResponse<>(justId);
        }), JSON);
        
        delete("/recipes/:id", sqlRoute((req, res, sql) -> {
            int recipeId = Integer.valueOf(req.params(":id"));
            int id = sql.deleteRecipe(recipeId);
            if (id == -1) {
                res.status(500);
                return "Could not delete recipe. Unknown SQL error";
            }
            res.status(200);
            return null;
        }), JSON);
    }

    static InputStream getResource(String path) {
        return RecipeEndpoint.class.getClassLoader().getResourceAsStream("webapp" + path);
    }

    static Object serveFiles(Request req, Response res) throws Exception {
        String requestUrl = req.pathInfo().replace("/nonna", "");
        if (requestUrl.trim().isEmpty() || requestUrl.equals("/")) {
            requestUrl = "/index.html";
        }
        InputStream resource = getResource(requestUrl);
        if (resource == null) {
            resource = getResource("/index.html");
        }
        if (resource != null) {
            final ServletOutputStream os = res.raw().getOutputStream();
            byte[] buffer = new byte[1024];
            int len;
            while ((len = resource.read(buffer)) != -1) {
                os.write(buffer, 0, len);
            }
            resource.close();
            os.close();

        }
        res.status(404);
        return "404 - Not Found";
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
    
    static Map<String, List<String>> paramsToMap(QueryParamsMap map){
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

}
