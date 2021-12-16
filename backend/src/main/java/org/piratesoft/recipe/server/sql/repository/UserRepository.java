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

    public int saveUser(RecipeUser user, boolean insertOnly) {

        List<RecipeUser> userByEmail = getUser(user.email);
        
        return sql.runInTrx(() -> {

            String statement = "INSERT INTO RecipeUser (email, fullName, userRole) VALUES(?,?,?)";
            List<Object> queryParams = Arrays.asList(user.email.trim().toLowerCase(), user.name, user.userRole);
            
            // Make sure there are no spaces
            user.userRole = user.normalizeRole();

            if (!user.hasValidRole()) {
                System.out.println("Invalid role detected " + user.userRole);
                return -1;
            }


            if (userByEmail.size() > 0) {
                if (insertOnly) {
                    return userByEmail.get(0).id;
                }
                statement = "UPDATE RecipeUser SET userRole = ? WHERE id = ?";
                queryParams = Arrays.asList(user.userRole, user.id);
                return sql.executeUpdate(statement, queryParams);
            }

            return sql.executeInsert(statement, queryParams);
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
        List<RecipeUser> users = sql.executeQuery("SELECT * FROM RecipeUser", Collections.emptyList(),
                UserRepository::resultSetToUser);
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
