package org.piratesoft.recipe.server.auth;

import org.piratesoft.recipe.server.schema.RecipeUser;

public class VerifyResponse {
    public boolean ok;
    public RecipeUser user;

    public VerifyResponse() {
        this(false, null);
    }

    public VerifyResponse(boolean ok, RecipeUser user) {
        this.ok = ok;
        this.user = user;
    }
}
