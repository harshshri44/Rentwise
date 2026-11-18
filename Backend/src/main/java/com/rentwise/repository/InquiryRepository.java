package com.rentwise.repository;

import com.rentwise.model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByOwnerEmailOrderByCreatedAtDesc(String ownerEmail);
    List<Inquiry> findBySenderEmailOrderByCreatedAtDesc(String senderEmail);
    List<Inquiry> findByPropertyIdOrderByCreatedAtDesc(String propertyId);
}
