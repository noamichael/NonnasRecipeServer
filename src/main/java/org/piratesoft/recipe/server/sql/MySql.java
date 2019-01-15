package org.piratesoft.recipe.server.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.piratesoft.recipe.server.schema.Ingredient;
import org.piratesoft.recipe.server.schema.Recipe;
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

    public List<Recipe> getRecipes(int page, int count) {
        return createAndExecute("SELECT * FROM Recipe", Collections.emptyList(), this::resultSetToRecipe);
    }

    public Optional<Recipe> getRecipe(int id) {
        List<Recipe> recipeResult = createAndExecute(
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

    List<Ingredient> getIngredients(int recipeId) {
        return createAndExecute(
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
        return createAndExecute(
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

    <T> List<T> createAndExecute(String query, List<Object> params, SQLFunction<ResultSet, T> mapper) {
        try {
            // create the java statement
            PreparedStatement st = con.prepareStatement(query);

            for (int i = 0; i < params.size(); i++) {
                int paramIndex = i + 1;
                Object param = params.get(i);
                if (param instanceof Integer) {
                    st.setInt(paramIndex, (int) param);
                } else if (param instanceof String) {
                    st.setString(paramIndex, (String) param);
                }
            }

            // execute the query, and get a java resultset
            ResultSet rs = st.executeQuery();
            List<T> results = new ArrayList<>();
            while (rs.next()) {
                T singleRow = mapper.apply(rs);
                results.add(singleRow);
            }
            st.close();
            return results;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    interface SQLFunction<Arg, Return> {

        Return apply(Arg arg) throws SQLException;
    }
}
