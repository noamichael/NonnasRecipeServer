/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.piratesoft.recipe.server.schema;

import java.math.BigDecimal;
import java.math.BigInteger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

/**
 *
 * @author micha_000
 */
public interface JsonRequest {

    JsonObjectBuilder toJson();

    class NullSafeJsonObjectBuilder implements JsonObjectBuilder {

        private final JsonObjectBuilder delegate = Json.createObjectBuilder();

        @Override
        public JsonObjectBuilder add(String key, JsonValue val) {
            if (val != null) {

                delegate.add(key, val);
            }
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, String val) {
            if (val != null) {
                delegate.add(key, val);
            }
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, BigInteger val) {
            if (val != null) {
                return delegate.add(key, val);
            }
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, BigDecimal val) {
            if (val != null) {
                return delegate.add(key, val);
            }
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, int val) {
            delegate.add(key, val);
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, long val) {
            delegate.add(key, val);
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, double val) {
            delegate.add(key, val);
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, boolean val) {
            delegate.add(key, val);
            return this;
        }

        @Override
        public JsonObjectBuilder addNull(String key) {
            delegate.addNull(key);
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, JsonObjectBuilder val) {
            if (val != null) {
                return delegate.add(key, val);
            }
            return this;
        }

        @Override
        public JsonObjectBuilder add(String key, JsonArrayBuilder val) {
            if (val != null) {
                return delegate.add(key, val);
            }
            return this;
        }

        @Override
        public JsonObject build() {
            return delegate.build();
        }

    }
}
