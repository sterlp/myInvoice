package org.sterl.common.jpa;

import lombok.Data;

@Data
public class Query {
    public static Integer DEFAULT_MAX = 20;
    private Integer firstResult;
    private Integer maxResults = DEFAULT_MAX;
}