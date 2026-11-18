package com.rentwise.dto;

import jakarta.validation.constraints.NotBlank;

public class InquiryRequest {

    @NotBlank(message = "Property ID is required")
    private String propertyId;

    private String propertyTitle;

    @NotBlank(message = "Your name is required")
    private String senderName;

    private String senderEmail;

    @NotBlank(message = "Your phone number is required")
    private String senderPhone;

    private String message;

    public InquiryRequest() {}

    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderPhone() {
        return senderPhone;
    }

    public void setSenderPhone(String senderPhone) {
        this.senderPhone = senderPhone;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
