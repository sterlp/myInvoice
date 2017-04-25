/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.sterl.common.jpa;

import lombok.Data;

@Data
public class Query {
    private Integer firstResult;
    private Integer maxResults;
}
