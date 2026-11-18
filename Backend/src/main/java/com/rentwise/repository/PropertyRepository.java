package com.rentwise.repository;

import com.rentwise.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, String>, JpaSpecificationExecutor<Property> {
    List<Property> findByIsListedTrue();
    Page<Property> findByIsListedTrue(Pageable pageable);
    List<Property> findByOwnerEmail(String ownerEmail);
    List<Property> findByOwnerEmailAndIsListedTrue(String ownerEmail);
    List<Property> findByCityIgnoreCaseAndIsListedTrue(String city);
}
