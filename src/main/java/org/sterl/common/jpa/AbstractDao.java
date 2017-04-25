package org.sterl.common.jpa;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public abstract class AbstractDao<IdType, EntityType> {
    
    @PersistenceContext protected EntityManager em;
    protected final Class<EntityType> entity;

    public AbstractDao(Class<EntityType> entity) {
        this.entity = entity;
    }
    public List<EntityType> findAll() {
        return findAll(null).getData();
    }

    public PageResult<EntityType> findAll(Query query) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<EntityType> cq = cb.createQuery(entity);
        Root<EntityType> rootEntry = cq.from(entity);
        CriteriaQuery<EntityType> all = cq.select(rootEntry);
        TypedQuery<EntityType> allQuery = em.createQuery(all);
        
        if (query != null) {
            if (query.getFirstResult() != null) allQuery.setFirstResult(query.getFirstResult());
            if (query.getMaxResults() != null) allQuery.setMaxResults(query.getMaxResults());
        }

        return new PageResult(allQuery.getResultList(), query);
    }
}