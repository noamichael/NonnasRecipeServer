/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.piratesoft.recipe.server.schema;

import javax.json.Json;
import javax.json.JsonObjectBuilder;

/**
 *
 * @author micha_000
 */
public class RecipeResponse implements JsonRequest {

    private Status status;
    private Type type;
    private RecipeError error;
    private String nowPlaying;

    public RecipeResponse() {
    }

    public RecipeResponse(Type type) {
        this.type = type;
    }

     /**
     * @return nowPlaying
     */
    public String getNowPlaying() {
        return nowPlaying;
    }

    /**
     * @param nowPlaying  to set
     */
    public void setNowPlaying(String nowPlaying) {
        this.nowPlaying = nowPlaying;
    }

    /**
     * @return the status
     */
    public Status getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Status status) {
        this.status = status;
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

    @Override
    public JsonObjectBuilder toJson() {
        JsonObjectBuilder builder = Json.createObjectBuilder();
        if (status != null) {
            builder.add("status", status.name());
        }
       if (nowPlaying != null) {
            builder.add("nowPlaying", nowPlaying);
        }
        if (type != null) {
            builder.add("type", type.name());
        }
        if (error != null) {
            builder.add("error", error.toJson());
        }
        return builder;
    }

    /**
     * @return the type
     */
    public Type getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(Type type) {
        this.type = type;
    }

    public enum Type {
        COLOR, PATTERN, ANIMATION;
    }

    public enum Status {
        COMPLETE, PENDING, RUNNING, ERROR, SHUTDOWN;
    }

    public static class RecipeError implements JsonRequest {

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

        @Override
        public JsonObjectBuilder toJson() {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            if (code != null) {
                builder.add("code", code);
            }
            if (message != null) {
                builder.add("message", message);
            }
            return builder;
        }
    }
}