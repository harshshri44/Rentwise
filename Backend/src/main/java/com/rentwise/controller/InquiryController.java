package com.rentwise.controller;

import com.rentwise.dto.InquiryRequest;
import com.rentwise.model.Inquiry;
import com.rentwise.service.InquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inquiries")
@Tag(name = "Inquiries", description = "Endpoints for customer-owner inquiries and contact messages")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    @Operation(summary = "Submit a rental inquiry / contact owner")
    public ResponseEntity<Inquiry> createInquiry(
            @Valid @RequestBody InquiryRequest request,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : null;
        Inquiry saved = inquiryService.createInquiry(request, email);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/my-inquiries")
    @Operation(summary = "Get inquiries received for properties owned by logged-in user")
    public ResponseEntity<List<Inquiry>> getMyInquiries(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(inquiryService.getInquiriesForOwner(authentication.getName()));
    }
}
