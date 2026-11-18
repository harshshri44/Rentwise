package com.rentwise.dto;

import com.rentwise.model.Property;
import com.rentwise.model.PropertyContact;
import java.util.List;

public class PropertyDto {
    private String id;
    private String title;
    private String city;
    private String locality;
    private String address;
    private String propertyType;
    private String category;
    private int bedrooms;
    private int bathrooms;
    private int areaSqFt;
    private double monthlyRent;
    private double securityDeposit;
    private String furnishing;
    private List<String> amenities;
    private List<String> photos;
    private String description;
    private String availability;
    private String availableDate;
    private PropertyContact contact;
    private boolean isFavorite;
    private boolean isUserSubmitted;
    private boolean isDemo;
    private String createdAt;
    private String ownerEmail;

    public PropertyDto() {}

    public static PropertyDto fromEntity(Property p) {
        PropertyDto dto = new PropertyDto();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setCity(p.getCity());
        dto.setLocality(p.getLocality());
        dto.setAddress(p.getAddress());
        dto.setPropertyType(p.getPropertyType());
        dto.setCategory(p.getCategory());
        dto.setBedrooms(p.getBedrooms());
        dto.setBathrooms(p.getBathrooms());
        dto.setAreaSqFt(p.getAreaSqFt());
        dto.setMonthlyRent(p.getMonthlyRent());
        dto.setSecurityDeposit(p.getSecurityDeposit());
        dto.setFurnishing(p.getFurnishing());
        dto.setAmenities(p.getAmenities());
        dto.setPhotos(p.getPhotos());
        dto.setDescription(p.getDescription());
        dto.setAvailability(p.getAvailability());
        dto.setAvailableDate(p.getAvailableDate());
        dto.setContact(p.getContact());
        dto.setFavorite(false);
        dto.setUserSubmitted(p.getOwnerEmail() != null && !p.getOwnerEmail().isEmpty());
        dto.setDemo(p.isDemo());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setOwnerEmail(p.getOwnerEmail());
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(int bedrooms) {
        this.bedrooms = bedrooms;
    }

    public int getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(int bathrooms) {
        this.bathrooms = bathrooms;
    }

    public int getAreaSqFt() {
        return areaSqFt;
    }

    public void setAreaSqFt(int areaSqFt) {
        this.areaSqFt = areaSqFt;
    }

    public double getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(double monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(double securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public String getFurnishing() {
        return furnishing;
    }

    public void setFurnishing(String furnishing) {
        this.furnishing = furnishing;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public List<String> getPhotos() {
        return photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getAvailableDate() {
        return availableDate;
    }

    public void setAvailableDate(String availableDate) {
        this.availableDate = availableDate;
    }

    public PropertyContact getContact() {
        return contact;
    }

    public void setContact(PropertyContact contact) {
        this.contact = contact;
    }

    public boolean isFavorite() {
        return isFavorite;
    }

    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }

    public boolean isUserSubmitted() {
        return isUserSubmitted;
    }

    public void setUserSubmitted(boolean userSubmitted) {
        isUserSubmitted = userSubmitted;
    }

    public boolean isDemo() {
        return isDemo;
    }

    public void setDemo(boolean demo) {
        isDemo = demo;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}
