package org.piratesoft.recipe.server.auth;

public class VerifyResponse {
    public boolean ok;

    public VerifyResponse() {
        this(false);
    }

    public VerifyResponse(boolean ok) {
        this.ok = ok;
    }
}
