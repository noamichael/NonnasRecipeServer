package org.piratesoft.recipe.server.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.piratesoft.recipe.server.schema.Ingredient;
import org.piratesoft.recipe.server.schema.Recipe;
import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.schema.RecipeStep;

/**
 *
 * @author kucin
 */
public class MySql {

    private Connection con = null;
    private final String USERNAME = "***REMOVED***";
    private final String PASSWORD = "***REMOVED***";
    //private static final String DRIVER = "com.mysql.jdbc.Driver";
    private final String URL = "jdbc:mysql://localhost:3306/NonnasRecipes";

    public MySql() throws SQLException {
        con = DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    public void destroy() {
        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public RecipeResponse<List<Recipe>> getRecipes(int page, int count) {
        RecipeResponse<List<Recipe>> response = new RecipeResponse<>();

        int offset = count * (page - 1);
        List<Recipe> pagedResult = executeQuery(
                "SELECT * FROM Recipe LIMIT ? OFFSET ?",
                Arrays.asList(count, offset),
                this::resultSetToRecipe
        );
        int totalRecordCount = executeQuery(
                "SELECT COUNT(ID) as totalRecordCount FROM Recipe",
                Collections.emptyList(),
                rs -> rs.getInt("totalRecordCount")
        ).get(0);

        response.setCount(count);
        response.setData(pagedResult);
        response.setPage(page);
        response.setTotalRecordCount(totalRecordCount);

        return response;
    }

    public Optional<Recipe> getRecipe(int id) {
        List<Recipe> recipeResult = executeQuery(
                "SELECT * FROM Recipe WHERE id = ?",
                Arrays.asList(id),
                this::resultSetToRecipe
        );

        if (recipeResult.isEmpty()) {
            return Optional.empty();
        }

        Recipe recipe = recipeResult.get(0);

        recipe.setIngredients(getIngredients(id));
        recipe.setSteps(getRecipeSteps(id));

        //load steps and ingredients
        return Optional.of(recipe);
    }

    public int deleteRecipe(int id) {
        deleteStepsAndIngredients(id);
        return executeUpdate("DELETE FROM Recipe WHERE ID = ?", Arrays.asList(id));
    }

    public int saveRecipe(Recipe recipe) {
        Integer id = recipe.getId();
        List<Object> insertAndUpdateArgs = new ArrayList<>();
        insertAndUpdateArgs.addAll(Arrays.asList(
                recipe.getRecipeName(),
                recipe.getRecipeType().toString().toUpperCase(),
                recipe.getCookTime(),
                recipe.getServingSize()
        ));
        if (id != null) {

            String update = "UPDATE Recipe SET "
                    + "recipeName = ?, "
                    + "recipeType = ?, "
                    + "cookTime = ?, "
                    + "servingSize = ? "
                    + "WHERE ID = ?";

            insertAndUpdateArgs.add(id);

            int updateRecipeResult = executeUpdate(update, insertAndUpdateArgs);

            if (updateRecipeResult < 1) {
                return -1;
            }

            deleteStepsAndIngredients(id);

        } else {
            String insert = "INSERT INTO Recipe (recipeName, recipeType, cookTime, servingSize) VALUES(?,?,?,?)";
            id = executeInsert(insert, insertAndUpdateArgs);
        }
        final int recipeId = id;//need to use a final int for lambda

        recipe.getIngredients().forEach(ingredient -> {
            String insertIngredient = "INSERT INTO Ingredient (recipeId, ingredientDescription) VALUES(?,?)";
            executeInsert(insertIngredient, Arrays.asList(recipeId, ingredient.getIngredientDescription()));
        });

        List<RecipeStep> recipeSteps = recipe.getSteps();

        for (int i = 0; i < recipeSteps.size(); i++) {
            RecipeStep step = recipeSteps.get(i);
            String insertStep = "INSERT INTO RecipeStep (recipeId, stepOrder, stepDescription) VALUES(?,?,?)";
            executeInsert(insertStep, Arrays.asList(recipeId, i + 1, step.getStepDescription()));
        }

        return recipeId;
    }

    List<Ingredient> getIngredients(int recipeId) {
        return executeQuery(
                "SELECT * FROM Ingredient WHERE recipeId = ?",
                Arrays.asList(recipeId),
                (rs) -> {
                    Ingredient ingredient = new Ingredient();
                    ingredient.setIngredientDescription(rs.getString("ingredientDescription"));
                    return ingredient;
                }
        );
    }

    List<RecipeStep> getRecipeSteps(int recipeId) {
        return executeQuery(
                "SELECT * FROM RecipeStep WHERE recipeId = ? ORDER BY stepOrder ASC",
                Arrays.asList(recipeId),
                (rs) -> {
                    RecipeStep recipeStep = new RecipeStep();
                    recipeStep.setStepDescription(rs.getString("stepDescription"));
                    return recipeStep;
                }
        );
    }

    Recipe resultSetToRecipe(ResultSet rs) throws SQLException {
        Recipe recipe = new Recipe();

        recipe.setId(rs.getInt("id"));
        recipe.setRecipeType(Recipe.RecipeType.valueOf(rs.getString("recipeType").toUpperCase()));
        recipe.setRecipeName(rs.getString("recipeName"));
        recipe.setCookTime(rs.getString("cookTime"));
        recipe.setServingSize(rs.getInt("servingSize"));

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
            Logger.getLogger(MySql.class.getName()).log(Level.SEVERE, null, ex);
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
