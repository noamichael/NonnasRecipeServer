package org.piratesoft.recipe.server.auth;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;

import org.piratesoft.recipe.server.schema.RecipeUser;
import org.piratesoft.recipe.server.util.StringUtil;


public class AuthVerifier {

    final Logger LOGGER = Logger.getLogger(AuthVerifier.class.getName());
    final String CLIENT_ID = System.getenv("GOOGLE_CLIENT_ID");
    final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    final JsonFactory GSON = new GsonFactory();

    final GoogleIdTokenVerifier _verifier = new GoogleIdTokenVerifier.Builder(HTTP_TRANSPORT, GSON)
            .setAudience(Collections.singletonList(CLIENT_ID)).build();

    public RecipeUser verify(String token) {

        String userImpersonation = System.getenv("USER_IMPERSONATION");

        // TODO: implement way to impersonate any user
        if (!StringUtil.isNullOrEmpty(userImpersonation)) {
            RecipeUser admin = new RecipeUser();
            String[] parts = userImpersonation.split(":");
            admin.email = parts[0];
            admin.id = 1;
            admin.name = parts[1];
            
            return admin;
        }

        try {
            GoogleIdToken idToken = _verifier.verify(token);

            if (idToken == null) {
                LOGGER.info("ID oken is INVALID!");
                return null;
            }
            
            GoogleIdToken.Payload jwtPayload = idToken.getPayload();
            
            RecipeUser user = new RecipeUser();

            user.email = jwtPayload.getEmail();
            //user.jwtId = jwtPayload.getJwtId();
            user.name = (String) jwtPayload.get("name");
            user.picture = (String) jwtPayload.get("picture");
            
            return user;
        } catch (GeneralSecurityException | IOException e) {
            LOGGER.log(Level.WARNING, "Could not verify token", e);
            return null;
        }
    }
}