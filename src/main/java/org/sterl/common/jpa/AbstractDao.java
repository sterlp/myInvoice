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
    /**
     * @param id the id of the entity, if null result is null too
     * @return the found entity or null if not found
     */
    public EntityType get(IdType id) {
        if (id == null) return null;
        return em.find(entity, id);
    }
    
    public void create(EntityType entity) {
        em.persist(entity);
    }
    
    public EntityType update(EntityType updateCreate) {
        return em.merge(updateCreate);
    }
    
    public List<EntityType> findAll() {
        return findAll(null).getData();
    }

    /**
     * Search using the given query, if the query is null it is ignored
     * at all an all data is returned!
     * @return PageResult of the given entity, never null
     */ 
    public PageResult<EntityType> findAll(Query query) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<EntityType> cq = cb.createQuery(entity);
        Root<EntityType> rootEntry = cq.from(entity);
        CriteriaQuery<EntityType> all = cq.select(rootEntry);
        TypedQuery<EntityType> allQuery = em.createQuery(all);
        
        if (query != null) {
            if (query.getMaxResults() == null) query.setMaxResults(Query.DEFAULT_MAX);
            if (query.getFirstResult() != null) allQuery.setFirstResult(query.getFirstResult());
            allQuery.setMaxResults(query.getMaxResults());
        }

        return new PageResult(allQuery.getResultList(), query);
    }
}