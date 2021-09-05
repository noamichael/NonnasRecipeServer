package org.piratesoft.recipe.server.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.piratesoft.recipe.server.schema.Ingredient;
import org.piratesoft.recipe.server.schema.Recipe;
import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.schema.RecipeStep;
import org.piratesoft.recipe.server.util.StringUtil;

/**
 *
 * @author kucin
 */
public class MySql {

    private final static Logger LOGGER = Logger.getLogger(MySql.class.getName());
    private Connection con = null;
    private final String URL = "jdbc:mysql://" + System.getenv("DATABASE_HOST") + ":3306/NonnasRecipes";

    public MySql(SqlCreds creds) throws SQLException {
        con = DriverManager.getConnection(
            URL,
            creds.getUsername(),
            creds.getPassword()
        );
    }

    public void destroy() {
        try {
            con.close();
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, null, e);
        }
    }

    public RecipeResponse<List<Recipe>> getRecipes(int page, int count, Map<String, List<String>> queryParams) {
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

        int offset = count * (page - 1);
        List<Object> paramsWithOffset = new ArrayList<>(params);
        paramsWithOffset.addAll(Arrays.asList(count, offset));
        List<Recipe> pagedResult = executeQuery(String
                .format("SELECT R.* FROM Recipe R WHERE 1 = 1%s ORDER BY R.recipeName ASC LIMIT ? OFFSET ?", where),
                paramsWithOffset, this::resultSetToRecipe);
        int totalRecordCount = executeQuery(
                String.format("SELECT COUNT(R.ID) as totalRecordCount FROM Recipe R WHERE 1 = 1%s", where), params,
                rs -> rs.getInt("totalRecordCount")).get(0);

        response.setCount(count);
        response.setData(pagedResult);
        response.setPage(page);
        response.setTotalRecordCount(totalRecordCount);

        return response;
    }

    public Optional<Recipe> getRecipe(int id) {
        List<Recipe> recipeResult = executeQuery("SELECT * FROM Recipe WHERE id = ?", Arrays.asList(id),
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
        deleteStepsAndIngredients(id);
        return executeUpdate("DELETE FROM Recipe WHERE ID = ?", Arrays.asList(id));
    }

    public int saveRecipe(Recipe recipe) {
        try {
            con.setAutoCommit(false);
            Integer id = recipe.getId();
            List<Object> insertAndUpdateArgs = new ArrayList<>();
            insertAndUpdateArgs.addAll(Arrays.asList(
                recipe.getRecipeName(),
                recipe.getRecipeType().toString().toUpperCase(),
                recipe.getCookTime(),
                recipe.getServingSize(),
                recipe.getWeightWatchers(),
                recipe.getPoints()
            ));
            if (id != null) {

                String update = "UPDATE Recipe SET "
                    + "recipeName = ?, "
                    + "recipeType = ?, "
                    + "cookTime = ?, "
                    + "servingSize = ?, "
                    + "weightWatchers = ?, "
                    + "points = ? "
                    + "WHERE ID = ?";

                insertAndUpdateArgs.add(id);

                int updateRecipeResult = executeUpdate(update, insertAndUpdateArgs);

                if (updateRecipeResult < 1) {
                    return -1;
                }

                deleteStepsAndIngredients(id);

            } else {
                String insert = "INSERT INTO Recipe (recipeName, recipeType, cookTime, servingSize, weightWatchers, points) VALUES(?,?,?,?,?,?)";
                id = executeInsert(insert, insertAndUpdateArgs);
            }
            final int recipeId = id;// need to use a final int for lambda

            recipe.getIngredients().forEach(ingredient -> {
                if (StringUtil.isNullOrEmpty(ingredient.getIngredientDescription())) {
                    return;// this is equivlent to continue
                }
                String insertIngredient = "INSERT INTO Ingredient (recipeId, ingredientDescription) VALUES(?,?)";
                executeInsert(insertIngredient, Arrays.asList(recipeId, ingredient.getIngredientDescription()));
            });

            List<RecipeStep> recipeSteps = recipe.getSteps();

            for (int i = 0; i < recipeSteps.size(); i++) {
                RecipeStep step = recipeSteps.get(i);
                if (StringUtil.isNullOrEmpty(step.getStepDescription())) {
                    continue;
                }
                String insertStep = "INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription) VALUES(?,?,?)";
                executeInsert(insertStep, Arrays.asList(recipeId, i + 1, step.getStepDescription()));
            }

            con.commit();

            return recipeId;
        } catch (SQLException e) {
            try {
                LOGGER.log(Level.SEVERE, null, e);
                System.err.print("Transaction is being rolled back");
                con.rollback();
            } catch (SQLException rollbackException) {
                LOGGER.log(Level.SEVERE, null, e);
            }
        } finally {
            try {
                con.setAutoCommit(true);
            } catch (SQLException e) {
                LOGGER.log(Level.SEVERE, null, e);
            }
        }

        return -1;
    }

    List<Ingredient> getIngredients(int recipeId) {
        return executeQuery("SELECT * FROM Ingredient WHERE recipeId = ?", Arrays.asList(recipeId), (rs) -> {
            Ingredient ingredient = new Ingredient();
            ingredient.setIngredientDescription(rs.getString("ingredientDescription"));
            return ingredient;
        });
    }

    List<RecipeStep> getRecipeSteps(int recipeId) {
        return executeQuery("SELECT * FROM RecipeStep WHERE recipeId = ? ORDER BY stepOrder ASC",
                Arrays.asList(recipeId), (rs) -> {
                    RecipeStep recipeStep = new RecipeStep();
                    recipeStep.setStepDescription(rs.getString("stepDescription"));
                    return recipeStep;
                });
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

        return recipe;
    }

    void deleteStepsAndIngredients(int recipeId) {
        String deleteTemplate = "DELETE FROM %s WHERE recipeId = ?";

        executeUpdate(String.format(deleteTemplate, "Ingredient"), Arrays.asList(recipeId));
        executeUpdate(String.format(deleteTemplate, "RecipeStep"), Arrays.asList(recipeId));
    }

    //////
    // Helper SQL methods
    /////
    <T> List<T> executeQuery(String query, List<Object> params, SQLFunction<ResultSet, T> mapper) {
        try {
            // create the java statement
            PreparedStatement st = prepare(query, params, Statement.NO_GENERATED_KEYS);
            // execute the query, and get a java resultset
            ResultSet rs = st.executeQuery();
            List<T> results = new ArrayList<>();
            while (rs.next()) {
                T singleRow = mapper.apply(rs);
                results.add(singleRow);
            }
            st.close();
            return results;

        } catch (SQLException ex) {
           LOGGER.log(Level.SEVERE, null, ex);
        }
        return null;
    }

    PreparedStatement prepare(String query, List<Object> params, int options) throws SQLException {
        PreparedStatement st = con.prepareStatement(query, options);

        for (int i = 0; i < params.size(); i++) {
            int paramIndex = i + 1;
            Object param = params.get(i);
            if (param instanceof Integer) {
                st.setInt(paramIndex, (int) param);
            } else if (param instanceof String) {
                st.setString(paramIndex, (String) param);
            } else if (param instanceof Boolean) {
                st.setBoolean(paramIndex, (boolean) param);
            } else if (param == null) {
                st.setNull(paramIndex, java.sql.Types.NULL);
            }
        }
        return st;
    }

    int executeUpdate(String query, List<Object> args) {
        try {
            PreparedStatement statement = prepare(query, args, Statement.NO_GENERATED_KEYS);
            int r = statement.executeUpdate();
            statement.close();
            return r;
        } catch (SQLException ex) {
            Logger.getLogger(MySql.class.getName()).log(Level.SEVERE, null, ex);
            return -1;
        }
    }

    int executeInsert(String query, List<Object> args) {
        try {
            PreparedStatement statement = prepare(query, args, Statement.RETURN_GENERATED_KEYS);
            statement.executeUpdate();
            ResultSet keys = statement.getGeneratedKeys();
            int id = -1;
            if (keys.next()) {
                id = keys.getInt(1);
            }
            statement.close();
            return id;
        } catch (SQLException ex) {
            Logger.getLogger(MySql.class.getName()).log(Level.SEVERE, null, ex);
            return -1;
        }
    }

    interface SQLFunction<Arg, Return> {

        Return apply(Arg arg) throws SQLException;
    }
}
