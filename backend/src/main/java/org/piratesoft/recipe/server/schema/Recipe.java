package org.piratesoft.recipe.server.schema;

import java.util.List;

/**
 *
 * @author kucin
 */
public class Recipe {

    public enum RecipeType {
        BREAKFAST, BRUNCH, LUNCH, DINNER, DESSERT, SNACK, SOUP;
    }
    
    private Integer id;
    private Integer userId;
    private RecipeType recipeType;
    private String recipeName;
    private String cookTime;
    private String servingSize;
    private List<RecipeStep> steps;
    private List<Ingredient> ingredients;
    private Boolean weightWatchers;
    private Integer points;

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return the recipeType
     */
    public RecipeType getRecipeType() {
        return recipeType;
    }

    /**
     * @param recipeType the recipeType to set
     */
    public void setRecipeType(RecipeType recipeType) {
        this.recipeType = recipeType;
    }

    /**
     * @return the recipeName
     */
    public String getRecipeName() {
        return recipeName;
    }

    /**
     * @param recipeName the recipeName to set
     */
    public void setRecipeName(String recipeName) {
        this.recipeName = recipeName;
    }

    /**
     * @return the cookTime
     */
    public String getCookTime() {
        return cookTime;
    }

    /**
     * @param cookTime the cookTime to set
     */
    public void setCookTime(String cookTime) {
        this.cookTime = cookTime;
    }

    /**
     * @return the servingSize
     */
    public String getServingSize() {
        return servingSize;
    }

    /**
     * @param servingSize the servingSize to set
     */
    public void setServingSize(String servingSize) {
        this.servingSize = servingSize;
    }

    /**
     * @return the steps
     */
    public List<RecipeStep> getSteps() {
        return steps;
    }

    /**
     * @param steps the steps to set
     */
    public void setSteps(List<RecipeStep> steps) {
        this.steps = steps;
    }

    /**
     * @return the ingredients
     */
    public List<Ingredient> getIngredients() {
        return ingredients;
    }

    /**
     * @param ingredients the ingredients to set
     */
    public void setIngredients(List<Ingredient> ingredients) {
        this.ingredients = ingredients;
    }

    /**
     * @return the weightWatchers
     */
    public Boolean getWeightWatchers() {
        return weightWatchers;
    }

    /**
     * @param weightWatchers the weightWatchers to set
     */
    public void setWeightWatchers(Boolean weightWatchers) {
        this.weightWatchers = weightWatchers;
    }

    /**
     * @return the points
     */
    public Integer getPoints() {
        return points;
    }

    /**
     * @param points the points to set
     */
    public void setPoints(Integer points) {
        this.points = points;
    }

    /**
     * 
     * @return The the user id
     */
    public Integer getUserId() {
        return userId;
    }

    /**
     * 
     * @param userId The user id to set 
     */
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
