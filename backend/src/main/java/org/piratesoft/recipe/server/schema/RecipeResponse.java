package org.piratesoft.recipe.server.schema;

/**
 *
 * @author micha_000
 * @param <Data>
 */
public class RecipeResponse<Data> {

    private RecipeError error;
    private Data data;
    private Integer count;
    private Integer page;
    private Integer totalRecordCount;

    public RecipeResponse() {
    }
    
    public RecipeResponse(Data data) {
        this.data = data;
    }

    /**
     * @return the error
     */
    public RecipeError getError() {
        return error;
    }

    /**
     * @param error the error to set
     */
    public void setError(RecipeError error) {
        this.error = error;
    }

    /**
     * @return the data
     */
    public Data getData() {
        return data;
    }

    /**
     * @param data the data to set
     */
    public void setData(Data data) {
        this.data = data;
    }

    /**
     * @return the count
     */
    public Integer getCount() {
        return count;
    }

    /**
     * @param count the count to set
     */
    public void setCount(Integer count) {
        this.count = count;
    }

    /**
     * @return the page
     */
    public Integer getPage() {
        return page;
    }

    /**
     * @param page the page to set
     */
    public void setPage(Integer page) {
        this.page = page;
    }

    /**
     * @return the totalRecordCount
     */
    public Integer getTotalRecordCount() {
        return totalRecordCount;
    }

    /**
     * @param totalRecordCount the totalRecordCount to set
     */
    public void setTotalRecordCount(Integer totalRecordCount) {
        this.totalRecordCount = totalRecordCount;
    }

    public static class RecipeError {

        private String code;
        private String message;

        public RecipeError(String code, String message) {
            this.code = code;
            this.message = message;
        }

        /**
         * @return the code
         */
        public String getCode() {
            return code;
        }

        /**
         * @param code the code to set
         */
        public void setCode(String code) {
            this.code = code;
        }

        /**
         * @return the message
         */
        public String getMessage() {
            return message;
        }

        /**
         * @param message the message to set
         */
        public void setMessage(String message) {
            this.message = message;
        }

    }
}
