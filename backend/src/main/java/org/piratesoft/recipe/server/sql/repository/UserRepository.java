package org.piratesoft.recipe.server.sql.repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.piratesoft.recipe.server.schema.RecipeResponse;
import org.piratesoft.recipe.server.schema.RecipeUser;
import org.piratesoft.recipe.server.sql.MySql;

public class UserRepository {

    private MySql sql;

    public UserRepository(MySql sql) {
        this.sql = sql;
    }

    public int saveUser(RecipeUser user) {

        List<RecipeUser> userByEmail = getUser(user.email);

        if (userByEmail.size() > 0) {
            return userByEmail.get(0).id;
        }

        // Make sure there are no spaces
        user.userRole = user.normalizeRole();

        if (!user.hasValidRole()) {
            return -1;
        }

        return sql.runInTrx(() -> {
            List<Object> insertAndUpdateArgs = new ArrayList<>();
            insertAndUpdateArgs.addAll(Arrays.asList(user.email.trim().toLowerCase(), user.name, user.userRole));
            return sql.executeInsert("INSERT INTO RecipeUser (email, fullName, userRole) VALUES(?,?,?)", insertAndUpdateArgs);
        }, -1);
    }

    public List<RecipeUser> getUser(int userId) {
        return sql.executeQuery("SELECT * FROM RecipeUser WHERE id = ?", Arrays.asList(userId),
                UserRepository::resultSetToUser);
    }

    public List<RecipeUser> getUser(String email) {
        return sql.executeQuery("SELECT * FROM RecipeUser WHERE email = ?", Arrays.asList(email.toLowerCase().trim()),
                UserRepository::resultSetToUser);
    }

    public RecipeResponse<List<RecipeUser>> getUsers() {
        List<RecipeUser> users = sql.executeQuery("SELECT * FROM RecipeUser", Collections.emptyList(), UserRepository::resultSetToUser);
        return new RecipeResponse<List<RecipeUser>>(users);
    }

    public static RecipeUser resultSetToUser(ResultSet rs) throws SQLException {
        RecipeUser user = new RecipeUser();
        user.email = rs.getString("email");
        user.id = rs.getInt("id");
        user.name = rs.getString("fullName");
        user.userRole = rs.getString("userRole");
        return user;
    }
}
