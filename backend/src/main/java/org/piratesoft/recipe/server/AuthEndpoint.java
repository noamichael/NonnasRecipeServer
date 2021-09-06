package org.piratesoft.recipe.server;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import com.google.gson.Gson;

import org.piratesoft.recipe.server.auth.AuthVerifier;
import org.piratesoft.recipe.server.auth.VerifyRequest;
import org.piratesoft.recipe.server.auth.VerifyResponse;
import org.piratesoft.recipe.server.schema.RecipeUser;
import org.piratesoft.recipe.server.sql.MySql;
import org.piratesoft.recipe.server.sql.MySqlInstance;
import org.piratesoft.recipe.server.util.StringUtil;

import spark.Request;
import spark.Response;
import spark.ResponseTransformer;
import spark.Service;

public class AuthEndpoint {

    static final Logger LOGGER = Logger.getLogger(AuthEndpoint.class.getName());
    public static final String JWT_COOKIE = "nr_jwt";
    public static final String REQ_USER = "nr_req_user";
    public static final AuthVerifier VERIFIER = new AuthVerifier();

    public static void setupEndpoints(Service service) {

        final Gson gson = new Gson();
        final ResponseTransformer JSON = new JsonTransformer();

        service.before(AuthEndpoint::before);

        int TWENTY_FOUR_HOURS = 86400;

        service.post("/auth/verify", (req, res) -> {
            VerifyRequest request = gson.fromJson(req.body(), VerifyRequest.class);

            RecipeUser user = VERIFIER.verify(request.token);

            if (user != null) {
                MySql sql = MySqlInstance.get();
                // Make an entry in the database for this user if we haven't
                // seen them before
                int userId = sql.saveUser(user);
                if (userId < 0) {
                    res.status(500);
                    return "Error signing in.";
                }
                // Lookup user from database
                user = sql.getUser(userId).get(0);
                // String name, String value, int maxAge, boolean secured, boolean httpOnly
                res.cookie("/", JWT_COOKIE, request.token, TWENTY_FOUR_HOURS, true, true);
                return new VerifyResponse(true, user);
            } else {
                // Remove the cookie if it's invalid
                res.cookie("/", JWT_COOKIE, null, 0, true, true);
            }

            return new VerifyResponse();
        }, JSON);

        service.post("/auth/sign-out", (req, res) -> {
            res.cookie("/", JWT_COOKIE, null, 0, true, true);
            return new VerifyResponse(true, null);
        }, JSON);

        service.get("/auth/identity", (req, res) -> {
            Optional<RecipeUser> user = AuthEndpoint.lookupUser(req, MySqlInstance.get());

            if (!user.isPresent()) {
                res.status(404);
                return "{\"error\": \"Not Found\"}";
            }

            return user.get();
        }, JSON);

    }

    public static void before(Request request, Response response) {
        String jwt = request.cookie(JWT_COOKIE);

        if (StringUtil.isNullOrEmpty(jwt)) {
            return;
        }

        RecipeUser user = VERIFIER.verify(jwt);

        if (user != null) {
            request.attribute(REQ_USER, user);
        }
    }

    public static Optional<RecipeUser> extract(Request request) {
        return Optional.ofNullable((RecipeUser) request.attribute(REQ_USER));
    }

    public static Optional<RecipeUser> lookupUser(Request req, MySql sql) {
        Optional<RecipeUser> reqUser = AuthEndpoint.extract(req);

        if (!reqUser.isPresent()) {
            return reqUser;
        }

        RecipeUser requestUser = reqUser.get();

        // Lookup the user by email in the database
        List<RecipeUser> userFromDb = sql.getUser(requestUser.email);

        if (userFromDb.size() < 1) {
            return Optional.empty();
        }


        // Copy GCP sent values in database model
        RecipeUser fromDb = userFromDb.get(0);
        
        fromDb.picture = requestUser.picture;

        return Optional.of(fromDb);

    }
}
