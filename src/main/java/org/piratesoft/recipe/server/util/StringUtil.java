package org.piratesoft.recipe.server.util;

/**
 *
 * @author michaelkucinski
 */
public final class StringUtil {
    public static boolean isNullOrEmpty(String s){
        return s == null || s.trim().isEmpty();
    }
}
