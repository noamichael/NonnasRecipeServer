package org.piratesoft.recipe.server;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import spark.ResponseTransformer;

/**
 *
 * @author kucin
 */
public class JsonTransformer implements ResponseTransformer {

    private final Gson gson;
    
    public JsonTransformer(){
        GsonBuilder builder = new GsonBuilder();
        builder.disableHtmlEscaping();
        gson = builder.create();
    }

    @Override
    public String render(Object model) {
        if(model instanceof String){
            return (String) model;
        }
        return gson.toJson(model);
    }

}
