package org.piratesoft.recipe.server.sql;

public class SqlCreds {

    private String username;
    private String password;

    public SqlCreds(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public static SqlCreds readCredsFromSecret() {
        return new SqlCreds(
            System.getenv("MYSQL_USER"),
            System.getenv("MYSQL_PASSWORD"))
        ;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

}
