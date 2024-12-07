package org.piratesoft.recipe.server;

import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.Cookie;

import org.piratesoft.recipe.server.auth.AuthVerifier;
import org.piratesoft.recipe.server.auth.VerifyRequest;
import org.piratesoft.recipe.server.auth.VerifyResponse;
import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.schema.RecipeUser;
import org.piratesoft.recipe.server.sql.MySql;
import org.piratesoft.recipe.server.sql.MySqlInstance;
import org.piratesoft.recipe.server.sql.repository.UserRepository;
import org.piratesoft.recipe.server.util.StringUtil;

public class AuthEndpoint {

    static final Logger LOGGER = Logger.getLogger(AuthEndpoint.class.getName());
    public static final String JWT_COOKIE = "nr_jwt";
    public static final String REQ_USER = "nr_req_user";
    public static final AuthVerifier VERIFIER = new AuthVerifier();

    public static void setupEndpoints(Javalin service) {

        service.before(AuthEndpoint::before);

        int TWENTY_FOUR_HOURS = 86400;

        service.post("/auth/verify", (ctx) -> {
            VerifyRequest request = ctx.bodyAsClass(VerifyRequest.class);

            RecipeUser user = VERIFIER.verify(request.token);

            if (user == null) {
                // Remove the cookie if it's invalid
                ctx.cookie(
                    new Cookie(JWT_COOKIE, "", "/", 0, true, 0, true)
                );
                ctx.json(new VerifyResponse());
                return;
            } 

            UserRepository repository = new UserRepository(MySqlInstance.get());
            // Make an entry in the database for this user if we haven't
            // seen them before
            int userId = repository.saveUser(user, true);
            if (userId < 0) {
                ctx.status(401);
                ctx.result("Error signing in.");
                return;
            }
            // Lookup user from database
            user = repository.getUser(userId).get(0);
            // String name, String value, String path, int maxAge, boolean secured, int version, boolean httpOnly
            ctx.cookie(
                new Cookie(JWT_COOKIE, request.token, "/", TWENTY_FOUR_HOURS, true, 0, true)
            );
            ctx.json(new VerifyResponse(true, user));


        });

        service.post("/auth/sign-out", (ctx) -> {
            ctx.cookie(
                new Cookie(JWT_COOKIE, "", "/", 0, true, 0, true)
            );
            ctx.json(new VerifyResponse(true, null));
        });

        service.get("/auth/identity", (ctx) -> {
            Optional<RecipeUser> user = AuthEndpoint.lookupUser(ctx, MySqlInstance.get());

            if (!user.isPresent()) {
                ctx.status(404);
                ctx.json(new RecipeResponse.RecipeError("404", "Not Found"));
                return;
            }

            ctx.json(user.get());
        });

        service.get("/auth/users", (ctx) -> {
            Optional<RecipeUser> user = AuthEndpoint.lookupUser(ctx, MySqlInstance.get());

            if (!user.isPresent()) {
                ctx.status(401);
                ctx.json(new RecipeResponse.RecipeError("401", "Unauthorized"));
                return;
            }

            RecipeUser requestUser = user.get();

            if (!requestUser.canReadUsers()) {
                ctx.status(403);
                ctx.json(new RecipeResponse.RecipeError("403", "Forbidden"));
                return;
            }

            UserRepository repository = new UserRepository(MySqlInstance.get());

            ctx.json(repository.getUsers());
        });

        service.post("/auth/users", (ctx) -> {
            Optional<RecipeUser> user = AuthEndpoint.lookupUser(ctx, MySqlInstance.get());

            if (!user.isPresent()) {
                ctx.status(401);
                ctx.json(new RecipeResponse.RecipeError("401", "Unauthorized"));
                return;
            }

            RecipeUser requestUser = user.get();

            if (!requestUser.canUpdateUsers()) {
                ctx.status(403);
                ctx.json(new RecipeResponse.RecipeError("403", "Forbidden"));
                return;
            }

            RecipeUser userToSave = ctx.bodyAsClass(RecipeUser.class);

            if (userToSave.id == requestUser.id) {
                ctx.status(403);
                ctx.json(new RecipeResponse.RecipeError("403", "Forbidden - don't try to update yourself"));
                return;
            }

            UserRepository repository = new UserRepository(MySqlInstance.get());

            List<RecipeUser> userFromDbResult = repository.getUser(userToSave.id);

            if (userFromDbResult.size() < 1) {
                ctx.status(404);
                ctx.json(new RecipeResponse.RecipeError("404", "Not Found - User not found"));
                return;
            }

            RecipeUser userFromDb = userFromDbResult.get(0);

            // Only update their role for now... Not much else to change
            userFromDb.userRole = userToSave.userRole;
            userFromDb.userRole = userFromDb.normalizeRole();

            if (!userFromDb.hasValidRole()) {
                ctx.status(400);
                ctx.json(new RecipeResponse.RecipeError("400", "Bad Request - invalid role provided"));
                return;
            }

            int result = repository.saveUser(userFromDb, false);

            if (result < 0) {
                System.out.println("Could not save user " + userFromDb.name);
            }

            ctx.json(userFromDb);

        });

    }

    public static void before(Context ctx) {
        String jwt = ctx.cookie(JWT_COOKIE);
        String userImpersonation = System.getenv("USER_IMPERSONATION");

        if (StringUtil.isNullOrEmpty(userImpersonation) && StringUtil.isNullOrEmpty(jwt)) {
            return;
        }

        RecipeUser user = VERIFIER.verify(jwt);

        if (user != null) {
            ctx.attribute(REQ_USER, user);
        }
    }

    public static Optional<RecipeUser> extract(Context ctx) {
        return Optional.ofNullable((RecipeUser) ctx.attribute(REQ_USER));
    }

    public static Optional<RecipeUser> lookupUser(Context ctx, MySql sql) {
        Optional<RecipeUser> reqUser = AuthEndpoint.extract(ctx);

        if (!reqUser.isPresent()) {
            return reqUser;
        }

        UserRepository repository = new UserRepository(sql);

        RecipeUser requestUser = reqUser.get();

        // Lookup the user by email in the database
        List<RecipeUser> userFromDb = repository.getUser(requestUser.email);

        if (userFromDb.size() < 1) {
            return Optional.empty();
        }

        // Copy GCP sent values in database model
        RecipeUser fromDb = userFromDb.get(0);

        fromDb.picture = requestUser.picture;

        return Optional.of(fromDb);

    }
}
