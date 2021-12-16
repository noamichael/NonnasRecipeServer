package org.piratesoft.recipe.server.sql;

import java.sql.Connection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.sql.DataSource;

/**
 *
 * @author kucin
 */
public class MySql {

    private final static Logger LOGGER = Logger.getLogger(MySql.class.getName());
    private Connection con = null;

    public MySql(DataSource dataSource) throws SQLException {
        con = dataSource.getConnection();
    }

    public void destroy() {
        try {
            con.close();
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, null, e);
        }
    }

    
    //////
    // Helper SQL methods
    /////
    public <T> List<T> executeQuery(String query, List<Object> params, SQLFunction<ResultSet, T> mapper) {
        try {
            // create the java statement
            PreparedStatement st = prepare(query, params, Statement.NO_GENERATED_KEYS);
            // execute the query, and get a java resultset
            ResultSet rs = st.executeQuery();
            List<T> results = new ArrayList<>();
            while (rs.next()) {
                T singleRow = mapper.apply(rs);
                results.add(singleRow);
            }
            st.close();
            return results;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, null, ex);
        }
        return null;
    }

    public PreparedStatement prepare(String query, List<Object> params, int options) throws SQLException {
        PreparedStatement st = con.prepareStatement(query, options);

        for (int i = 0; i < params.size(); i++) {
            int paramIndex = i + 1;
            Object param = params.get(i);
            if (param instanceof Integer) {
                st.setInt(paramIndex, (int) param);
            } else if (param instanceof String) {
                st.setString(paramIndex, (String) param);
            } else if (param instanceof Boolean) {
                st.setBoolean(paramIndex, (boolean) param);
            } else if (param == null) {
                st.setNull(paramIndex, java.sql.Types.NULL);
            }
        }
        return st;
    }

    public int executeUpdate(String query, List<Object> args) {
        try {
            PreparedStatement statement = prepare(query, args, Statement.NO_GENERATED_KEYS);
            int r = statement.executeUpdate();
            statement.close();
            return r;
        } catch (SQLException ex) {
            Logger.getLogger(MySql.class.getName()).log(Level.SEVERE, null, ex);
            return -1;
        }
    }

    public int executeInsert(String query, List<Object> args) {
        try {
            PreparedStatement statement = prepare(query, args, Statement.RETURN_GENERATED_KEYS);
            statement.executeUpdate();
            ResultSet keys = statement.getGeneratedKeys();
            int id = -1;
            if (keys.next()) {
                id = keys.getInt(1);
            }
            statement.close();
            return id;
        } catch (SQLException ex) {
            Logger.getLogger(MySql.class.getName()).log(Level.SEVERE, null, ex);
            return -1;
        }
    }

    public <T> T runInTrx(SQLAction<T> action, T defaultValue) {
        try {
            con.setAutoCommit(false);
            T result = action.run();
            con.commit();
            return result;
        } catch (SQLException e) {
            try {
                LOGGER.log(Level.SEVERE, null, e);
                System.err.print("Transaction is being rolled back");
                con.rollback();
            } catch (SQLException rollbackException) {
                LOGGER.log(Level.SEVERE, null, e);
                return defaultValue;
            }
        } finally {
            try {
                con.setAutoCommit(true);
            } catch (SQLException e) {
                LOGGER.log(Level.SEVERE, null, e);
            }
        }

        return defaultValue;
    }

    public interface SQLFunction<Arg, Return> {

        Return apply(Arg arg) throws SQLException;
    }

    public interface SQLAction<Return> {

        Return run() throws SQLException;
    }
}
