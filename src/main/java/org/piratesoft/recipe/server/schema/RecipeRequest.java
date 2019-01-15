/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.piratesoft.recipe.server.schema;

import javax.json.JsonObject;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author micha_000
 */
@XmlRootElement
public class RecipeRequest {

    private JsonObject payload;

    public RecipeRequest(JsonObject jsonObject) {
        this.payload = jsonObject.getJsonObject("payload");
    }

    /**
     * @return the payload
     */
    public JsonObject getPayload() {
        return payload;
    }

    /**
     * @param payload the payload to set
     */
    public void setPayload(JsonObject payload) {
        this.payload = payload;
    }
}
