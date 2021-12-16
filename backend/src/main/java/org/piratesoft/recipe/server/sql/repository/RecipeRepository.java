package org.piratesoft.recipe.server.sql.repository;

import java.util.Map;
import java.util.Optional;
import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.piratesoft.recipe.server.schema.Ingredient;
import org.piratesoft.recipe.server.schema.Recipe;
import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.schema.RecipeStep;
import org.piratesoft.recipe.server.schema.RecipeUser;
import org.piratesoft.recipe.server.sql.MySql;
import org.piratesoft.recipe.server.util.StringUtil;

public class RecipeRepository {

    private MySql sql;

    public RecipeRepository(MySql sql) {
        this.sql = sql;
    }

    public RecipeResponse<List<Recipe>> getRecipes(int page, int count, RecipeUser user,
            Map<String, List<String>> queryParams) {
        RecipeResponse<List<Recipe>> response = new RecipeResponse<>();
        List<Object> params = new ArrayList<>();
        String where = "";

        if (queryParams.containsKey("recipeName")) {
            List<String> recipeNames = queryParams.get("recipeName");
            for (String recipeName : recipeNames) {
                where = where.concat(" AND R.recipeName LIKE ?");
                params.add("%" + recipeName + "%");
            }
        }

        if (queryParams.containsKey("recipeType")) {
            List<String> recipeTypes = queryParams.get("recipeType");
            for (String recipeType : recipeTypes) {
                where = where.concat(" AND R.recipeType = ?");
                params.add(recipeType);
            }
        }

        if (queryParams.containsKey("weightWatchers")) {
            String weightWatchers = queryParams.get("weightWatchers").get(0);
            if (!"null".equals(weightWatchers)) {
                where = where.concat(" AND R.weightWatchers = ?");
                params.add(Boolean.valueOf(weightWatchers.trim()));
            }
        }

        if (queryParams.containsKey("userId")) {
            String userId = queryParams.get("userId").get(0);
            where = where.concat(" AND R.userId = ?");
            params.add(userId);
        }

        int offset = count * (page - 1);
        List<Object> paramsWithOffset = new ArrayList<>(params);
        paramsWithOffset.addAll(Arrays.asList(count, offset));
        String select = this.baseRecipeSelect();
        List<Recipe> pagedResult = sql.executeQuery(
                String.format(select + " WHERE 1 = 1%s ORDER BY R.recipeName ASC LIMIT ? OFFSET ?", where),
                paramsWithOffset, this::resultSetToRecipe);
        int totalRecordCount = sql.executeQuery(
                String.format("SELECT COUNT(R.ID) as totalRecordCount FROM Recipe R WHERE 1 = 1%s", where), params,
                rs -> rs.getInt("totalRecordCount")).get(0);

        response.setCount(count);
        response.setData(pagedResult);
        response.setPage(page);
        response.setTotalRecordCount(totalRecordCount);

        return response;
    }

    private String baseRecipeSelect() {
        return "SELECT R.*, U.fullName FROM Recipe R INNER JOIN RecipeUser U ON U.id = R.userId";
    }

    public Optional<Recipe> getRecipe(int id) {
        List<Recipe> recipeResult = sql.executeQuery(this.baseRecipeSelect() + " WHERE R.id = ?", Arrays.asList(id),
                this::resultSetToRecipe);

        if (recipeResult.isEmpty()) {
            return Optional.empty();
        }

        Recipe recipe = recipeResult.get(0);

        recipe.setIngredients(getIngredients(id));
        recipe.setSteps(getRecipeSteps(id));

        // load steps and ingredients
        return Optional.of(recipe);
    }

    public int deleteRecipe(int id) {
        return sql.runInTrx(() -> {
            deleteStepsAndIngredients(id);
            return sql.executeUpdate("DELETE FROM Recipe WHERE ID = ?", Arrays.asList(id));
        }, -1);
    }

    public int saveRecipe(Recipe recipe) {
        return sql.runInTrx(() -> {
            Integer id = recipe.getId();
            List<Object> insertAndUpdateArgs = new ArrayList<>();
            insertAndUpdateArgs.addAll(Arrays.asList(recipe.getRecipeName(),
                    recipe.getRecipeType().toString().toUpperCase(), recipe.getCookTime(), recipe.getServingSize(),
                    recipe.getWeightWatchers(), recipe.getPoints()));
            if (id != null) {

                String update = "UPDATE Recipe SET " + "recipeName = ?, " + "recipeType = ?, " + "cookTime = ?, "
                        + "servingSize = ?, " + "weightWatchers = ?, " + "points = ? " + "WHERE ID = ?";

                insertAndUpdateArgs.add(id);

                int updateRecipeResult = sql.executeUpdate(update, insertAndUpdateArgs);

                if (updateRecipeResult < 1) {
                    return -1;
                }

                deleteStepsAndIngredients(id);

            } else {
                // Associate this recipe with a user
                insertAndUpdateArgs.add(recipe.getUserId());
                String insert = "INSERT INTO Recipe (recipeName, recipeType, cookTime, servingSize, weightWatchers, points, userId) VALUES(?,?,?,?,?,?,?)";
                id = sql.executeInsert(insert, insertAndUpdateArgs);
            }
            final int recipeId = id;// need to use a final int for lambda

            recipe.getIngredients().forEach(ingredient -> {
                if (StringUtil.isNullOrEmpty(ingredient.getIngredientDescription())) {
                    return;// this is equivlent to continue
                }
                String insertIngredient = "INSERT INTO Ingredient (recipeId, ingredientDescription) VALUES(?,?)";
                sql.executeInsert(insertIngredient, Arrays.asList(recipeId, ingredient.getIngredientDescription()));
            });

            List<RecipeStep> recipeSteps = recipe.getSteps();

            for (int i = 0; i < recipeSteps.size(); i++) {
                RecipeStep step = recipeSteps.get(i);
                if (StringUtil.isNullOrEmpty(step.getStepDescription())) {
                    continue;
                }
                String insertStep = "INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription) VALUES(?,?,?)";
                sql.executeInsert(insertStep, Arrays.asList(recipeId, i + 1, step.getStepDescription()));
            }

            return recipeId;
        }, -1);
    }

    public RecipeResponse<List<RecipeUser>>   getRecipeOwners() {
        List<RecipeUser> users = sql.executeQuery(
                "SELECT DISTINCT U.id, U.fullName, U.email, U.userRole FROM Recipe R INNER JOIN RecipeUser U ON U.id = R.userId",
                Collections.emptyList(), (rs) -> {
                    RecipeUser user = UserRepository.resultSetToUser(rs);
                    // Blank email. We don't want an public API which returns emails
                    user.email = null;
                    return user;
                });

        RecipeResponse<List<RecipeUser>>  response = new RecipeResponse<>(users);
        response.setCount(users.size());
        response.setPage(1);
        response.setTotalRecordCount(response.getCount());
        return response;
    }

    List<Ingredient> getIngredients(int recipeId) {
        return sql.executeQuery("SELECT * FROM Ingredient WHERE recipeId = ?", Arrays.asList(recipeId), (rs) -> {
            Ingredient ingredient = new Ingredient();
            ingredient.setIngredientDescription(rs.getString("ingredientDescription"));
            return ingredient;
        });
    }

    List<RecipeStep> getRecipeSteps(int recipeId) {
        return sql.executeQuery("SELECT * FROM RecipeStep WHERE recipeId = ? ORDER BY stepOrder ASC",
                Arrays.asList(recipeId), (rs) -> {
                    RecipeStep recipeStep = new RecipeStep();
                    recipeStep.setStepDescription(rs.getString("stepDescription"));
                    return recipeStep;
                });
    }

    void deleteStepsAndIngredients(int recipeId) {
        String deleteTemplate = "DELETE FROM %s WHERE recipeId = ?";

        sql.executeUpdate(String.format(deleteTemplate, "Ingredient"), Arrays.asList(recipeId));
        sql.executeUpdate(String.format(deleteTemplate, "RecipeStep"), Arrays.asList(recipeId));
    }

    Recipe resultSetToRecipe(ResultSet rs) throws SQLException {
        Recipe recipe = new Recipe();

        recipe.setId(rs.getInt("id"));
        recipe.setRecipeType(Recipe.RecipeType.valueOf(rs.getString("recipeType").toUpperCase()));
        recipe.setRecipeName(rs.getString("recipeName"));
        recipe.setCookTime(rs.getString("cookTime"));
        recipe.setServingSize(rs.getString("servingSize"));
        recipe.setWeightWatchers(rs.getBoolean("weightWatchers"));
        recipe.setPoints(rs.getInt("points"));
        recipe.setUserId(rs.getInt("userId"));

        // Join columns
        recipe.setUserFullName(rs.getString("fullName"));

        return recipe;
    }

}
