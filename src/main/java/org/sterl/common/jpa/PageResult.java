package org.sterl.common.jpa;

import java.util.List;
import lombok.Data;

@Data
public class PageResult<EntityType> {
    private final List<EntityType> data;
    private final Query query;
}
