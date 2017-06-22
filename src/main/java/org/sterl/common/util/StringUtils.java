package org.sterl.common.util;

public class StringUtils {
    public static String trimToEmpty(String value) {
        if (value == null) return "";
        else return value.trim();
    }
}
