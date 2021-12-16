package org.piratesoft.recipe.server.util;

/**
 *
 * @author michaelkucinski
 */
public final class StringUtil {

    public static boolean isNullOrEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }

    public static boolean equals(String s1, String s2) {
        if (s1 == null || s2 == null) {
            // null safe
            return s1 == s2;
        }
        return s1.trim().toLowerCase().equals(s2.trim().toLowerCase());
    }
}
