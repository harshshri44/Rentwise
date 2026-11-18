package com.rentwise.service;

import com.rentwise.dto.InquiryRequest;
import com.rentwise.model.Inquiry;
import com.rentwise.model.Property;
import com.rentwise.repository.InquiryRepository;
import com.rentwise.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;

    public InquiryService(InquiryRepository inquiryRepository, PropertyRepository propertyRepository) {
        this.inquiryRepository = inquiryRepository;
        this.propertyRepository = propertyRepository;
    }

    @Transactional
    public Inquiry createInquiry(InquiryRequest request, String optionalUserEmail) {
        String ownerEmail = null;
        String propertyTitle = request.getPropertyTitle();

        Property property = propertyRepository.findById(request.getPropertyId()).orElse(null);
        if (property != null) {
            ownerEmail = property.getOwnerEmail();
            if (ownerEmail == null && property.getContact() != null) {
                ownerEmail = property.getContact().getEmail();
            }
            if (propertyTitle == null || propertyTitle.isEmpty()) {
                propertyTitle = property.getTitle();
            }
        }

        String senderEmail = request.getSenderEmail();
        if ((senderEmail == null || senderEmail.isEmpty()) && optionalUserEmail != null) {
            senderEmail = optionalUserEmail;
        }

        Inquiry inquiry = new Inquiry(
                request.getPropertyId(),
                propertyTitle,
                request.getSenderName(),
                senderEmail,
                request.getSenderPhone(),
                request.getMessage() != null ? request.getMessage() : "Interested in your rental listing.",
                ownerEmail
        );

        return inquiryRepository.save(inquiry);
    }

    public List<Inquiry> getInquiriesForOwner(String ownerEmail) {
        return inquiryRepository.findByOwnerEmailOrderByCreatedAtDesc(ownerEmail);
    }
}
