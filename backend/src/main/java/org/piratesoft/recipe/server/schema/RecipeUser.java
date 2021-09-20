package org.piratesoft.recipe.server.schema;

import java.util.Arrays;

import org.piratesoft.recipe.server.util.StringUtil;

public class RecipeUser {

    public static final String READ_ONLY_ROLE = "readOnly";
    public static final String USER_ROLE = "user";
    public static final String ADMIN_ROLE = "admin";

    public Integer id;
    public String name;
    public String email;
    public String picture;
    public String userRole = READ_ONLY_ROLE;

    public boolean canWrite() {
        return !StringUtil.equals(READ_ONLY_ROLE, normalizeRole());
    }

    public boolean canUpdateUsers() {
        return StringUtil.equals(ADMIN_ROLE, normalizeRole());
    }

    public boolean canReadUsers() {
        return isAdmin();
    }

    public boolean isAdmin() {
        return StringUtil.equals(ADMIN_ROLE, normalizeRole());
    }

    public boolean hasValidRole() {
        return Arrays.asList(READ_ONLY_ROLE, USER_ROLE, ADMIN_ROLE).contains(userRole);
    }

    public String normalizeRole() {
        String role = this.userRole;

        if (StringUtil.isNullOrEmpty(role)) {
            role = READ_ONLY_ROLE;
        }

        return this.userRole.trim();

    }
}
