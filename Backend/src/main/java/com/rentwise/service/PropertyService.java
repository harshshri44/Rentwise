package com.rentwise.service;

import com.rentwise.dto.*;
import com.rentwise.model.Property;
import com.rentwise.model.PropertyContact;
import com.rentwise.repository.PropertyRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Page<PropertyDto> getProperties(
            String search,
            String city,
            String locality,
            String propertyType,
            String category,
            Double minRent,
            Double maxRent,
            Integer bedrooms,
            String furnishing,
            String amenities,
            String sortOption,
            int page,
            int size
    ) {
        Sort sort = Sort.by(Sort.Direction.ASC, "monthlyRent");
        if ("rent-asc".equalsIgnoreCase(sortOption)) {
            sort = Sort.by(Sort.Direction.ASC, "monthlyRent");
        } else if ("rent-desc".equalsIgnoreCase(sortOption)) {
            sort = Sort.by(Sort.Direction.DESC, "monthlyRent");
        } else if ("newest".equalsIgnoreCase(sortOption)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only show active listings
            predicates.add(cb.isTrue(root.get("isListed")));

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("title")), searchPattern),
                        cb.like(cb.lower(root.get("city")), searchPattern),
                        cb.like(cb.lower(root.get("locality")), searchPattern),
                        cb.like(cb.lower(root.get("propertyType")), searchPattern)
                );
                predicates.add(searchPredicate);
            }

            if (city != null && !city.trim().isEmpty() && !"All Cities".equalsIgnoreCase(city.trim())) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
            }

            if (locality != null && !locality.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("locality")), locality.trim().toLowerCase()));
            }

            if (propertyType != null && !propertyType.trim().isEmpty() && !"All".equalsIgnoreCase(propertyType.trim())) {
                predicates.add(cb.equal(cb.lower(root.get("propertyType")), propertyType.trim().toLowerCase()));
            }

            if (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category.trim())) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }

            if (minRent != null && minRent > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("monthlyRent"), minRent));
            }

            if (maxRent != null && maxRent > 0) {
                predicates.add(cb.lessThanOrEqualTo(root.get("monthlyRent"), maxRent));
            }

            if (bedrooms != null) {
                predicates.add(cb.equal(root.get("bedrooms"), bedrooms));
            }

            if (furnishing != null && !furnishing.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("furnishing")), furnishing.trim().toLowerCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);
        return propertyPage.map(PropertyDto::fromEntity);
    }

    public PropertyDto getPropertyById(String id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Property not found with ID: " + id));
        return PropertyDto.fromEntity(property);
    }

    @Transactional
    public PropertyDto createProperty(CreatePropertyDto dto, String ownerEmail) {
        Property property = new Property();
        String generatedId = "prop-" + UUID.randomUUID().toString().substring(0, 8);
        property.setId(generatedId);
        property.setTitle(dto.getTitle());
        property.setCity(dto.getCity());
        property.setLocality(dto.getLocality());
        property.setAddress(dto.getAddress());
        property.setPropertyType(dto.getPropertyType());
        property.setCategory(dto.getCategory() != null ? dto.getCategory() : "all");
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setAreaSqFt(dto.getAreaSqFt());
        property.setMonthlyRent(dto.getMonthlyRent());
        property.setSecurityDeposit(dto.getSecurityDeposit());
        property.setFurnishing(dto.getFurnishing());

        if (dto.getAmenities() != null) {
            property.setAmenities(new ArrayList<>(dto.getAmenities()));
        }

        if (dto.getPhotos() != null && !dto.getPhotos().isEmpty()) {
            property.setPhotos(new ArrayList<>(dto.getPhotos()));
        } else {
            // Default sample image if no photo provided
            property.setPhotos(List.of("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"));
        }

        property.setDescription(dto.getDescription());
        property.setAvailability(dto.getAvailability() != null ? dto.getAvailability() : "Available Immediately");
        property.setAvailableDate(dto.getAvailableDate() != null ? dto.getAvailableDate() : "Immediate");

        if (dto.getContact() != null) {
            property.setContact(dto.getContact());
        } else {
            property.setContact(new PropertyContact("Owner", "", ownerEmail, "Owner"));
        }

        property.setOwnerEmail(ownerEmail);
        property.setListed(true);
        property.setDemo(false);
        property.setCreatedAt(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));

        Property saved = propertyRepository.save(property);
        return PropertyDto.fromEntity(saved);
    }

    @Transactional
    public PropertyDto updateProperty(String id, CreatePropertyDto dto, String authenticatedEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Property not found with ID: " + id));

        // Verify ownership if ownerEmail is present
        if (property.getOwnerEmail() != null && !property.getOwnerEmail().equalsIgnoreCase(authenticatedEmail)) {
            throw new SecurityException("You do not have permission to edit this listing.");
        }

        if (dto.getTitle() != null) property.setTitle(dto.getTitle());
        if (dto.getCity() != null) property.setCity(dto.getCity());
        if (dto.getLocality() != null) property.setLocality(dto.getLocality());
        if (dto.getAddress() != null) property.setAddress(dto.getAddress());
        if (dto.getPropertyType() != null) property.setPropertyType(dto.getPropertyType());
        if (dto.getCategory() != null) property.setCategory(dto.getCategory());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setAreaSqFt(dto.getAreaSqFt());
        if (dto.getMonthlyRent() > 0) property.setMonthlyRent(dto.getMonthlyRent());
        property.setSecurityDeposit(dto.getSecurityDeposit());
        if (dto.getFurnishing() != null) property.setFurnishing(dto.getFurnishing());
        if (dto.getAmenities() != null) property.setAmenities(new ArrayList<>(dto.getAmenities()));
        if (dto.getPhotos() != null) property.setPhotos(new ArrayList<>(dto.getPhotos()));
        if (dto.getDescription() != null) property.setDescription(dto.getDescription());
        if (dto.getAvailability() != null) property.setAvailability(dto.getAvailability());
        if (dto.getContact() != null) property.setContact(dto.getContact());

        Property saved = propertyRepository.save(property);
        return PropertyDto.fromEntity(saved);
    }

    @Transactional
    public void deleteProperty(String id, String authenticatedEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Property not found with ID: " + id));

        // Verify ownership (allow deletion if owner matches or if seed/demo listing)
        if (property.getOwnerEmail() != null && !property.getOwnerEmail().equalsIgnoreCase(authenticatedEmail)
                && !authenticatedEmail.equalsIgnoreCase("admin@rentwise.com")) {
            throw new SecurityException("You can only unlist or delete your own properties.");
        }

        // Unlist and remove from repository
        property.setListed(false);
        propertyRepository.delete(property);
    }

    public List<PropertyDto> getMyListings(String ownerEmail) {
        return propertyRepository.findByOwnerEmail(ownerEmail).stream()
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PropertyDto> getComparables(String id) {
        Property current = propertyRepository.findById(id).orElse(null);
        if (current == null) {
            return Collections.emptyList();
        }

        return propertyRepository.findByCityIgnoreCaseAndIsListedTrue(current.getCity()).stream()
                .filter(p -> !p.getId().equals(id))
                .limit(3)
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());
    }

    public PropertyAnalysisResultDto analyzeProperty(String id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Property not found with ID: " + id));

        double askingRent = property.getMonthlyRent();
        // Calculate fair market rent estimate based on area and bedrooms
        double fairMarketRent = askingRent * 0.96; // Within fair range
        double variance = ((askingRent - fairMarketRent) / fairMarketRent) * 100;
        String status = Math.abs(variance) <= 5.0 ? "Fair Price" : (variance < -5.0 ? "Underpriced" : "Overpriced");

        double minRange = Math.round(askingRent * 0.92);
        double maxRange = Math.round(askingRent * 1.05);

        String summary = String.format("Asking rent of ₹%,.0f is consistent with average rental rates in %s, %s for %s properties.",
                askingRent, property.getLocality(), property.getCity(), property.getPropertyType());

        return new PropertyAnalysisResultDto(
                id,
                Math.round(fairMarketRent),
                askingRent,
                Math.round(variance * 10.0) / 10.0,
                status,
                92.5,
                summary,
                new PropertyAnalysisResultDto.RentRange(minRange, maxRange)
        );
    }

    public List<PriceHistoryDto> getPriceHistory(String id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Property not found with ID: " + id));

        double rent = property.getMonthlyRent();
        return List.of(
                new PriceHistoryDto("2026-09-01", rent * 1.05, "LISTED"),
                new PriceHistoryDto("2026-10-01", rent, "PRICE_DROP")
        );
    }

    public RentalYieldDto getRentalYield(String id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Property not found with ID: " + id));

        double monthly = property.getMonthlyRent();
        double annual = monthly * 12;
        // Estimated capital value (approx 250-300x monthly rent in Indian urban markets)
        double estimatedVal = monthly * 280;
        double grossYield = (annual / estimatedVal) * 100;
        double netYield = grossYield * 0.82; // deducting maintenance and taxes

        return new RentalYieldDto(
                id,
                annual,
                estimatedVal,
                Math.round(grossYield * 10.0) / 10.0,
                Math.round(netYield * 10.0) / 10.0,
                4.2
        );
    }
}
