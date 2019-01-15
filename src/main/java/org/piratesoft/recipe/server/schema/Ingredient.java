package org.piratesoft.recipe.server.schema;

/**
 *
 * @author kucin
 */
public class Ingredient {

    private Integer recipeId;
    private String ingredientDescription;

    /**
     * @return the recipeId
     */
    public Integer getRecipeId() {
        return recipeId;
    }

    /**
     * @param recipeId the recipeId to set
     */
    public void setRecipeId(Integer recipeId) {
        this.recipeId = recipeId;
    }

    /**
     * @return the ingredientDescription
     */
    public String getIngredientDescription() {
        return ingredientDescription;
    }

    /**
     * @param ingredientDescription the ingredientDescription to set
     */
    public void setIngredientDescription(String ingredientDescription) {
        this.ingredientDescription = ingredientDescription;
    }
}
