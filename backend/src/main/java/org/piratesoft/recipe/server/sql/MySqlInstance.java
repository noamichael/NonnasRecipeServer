package org.piratesoft.recipe.server.sql;

import java.sql.SQLException;

import javax.sql.DataSource;

public class MySqlInstance {

    // This variable is recreated for every thread
    private static final ThreadLocal<MySql> mySqlInstance = new ThreadLocal<>();
    // These creds are shared for all instances
    public static final SqlCreds SQL_CREDS = SqlCreds.readCredsFromSecret();
    // The pool of connections for this server
    private static final DataSource CONNECTION_POOL = ConnectionPool.createConnectionPool(SQL_CREDS);

    public static MySql get() throws SQLException {
        MySql instance = mySqlInstance.get();

        if (instance != null) {
            return instance;
        }

        instance = new MySql(CONNECTION_POOL);

        mySqlInstance.set(instance);

        return instance;
    }

    // Get's called by the server on request end
    public static void destroy() {
        MySql instance = mySqlInstance.get();

        if (instance != null) {
            instance.destroy();
        }

        mySqlInstance.remove();

    }

}
