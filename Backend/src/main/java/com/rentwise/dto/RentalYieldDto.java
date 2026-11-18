package com.rentwise.dto;

public class RentalYieldDto {
    private String propertyId;
    private double annualRent;
    private double estimatedPropertyValue;
    private double grossRentalYieldPercent;
    private double netRentalYieldPercent;
    private double marketAverageYieldPercent;

    public RentalYieldDto() {}

    public RentalYieldDto(String propertyId, double annualRent, double estimatedPropertyValue, double grossRentalYieldPercent, double netRentalYieldPercent, double marketAverageYieldPercent) {
        this.propertyId = propertyId;
        this.annualRent = annualRent;
        this.estimatedPropertyValue = estimatedPropertyValue;
        this.grossRentalYieldPercent = grossRentalYieldPercent;
        this.netRentalYieldPercent = netRentalYieldPercent;
        this.marketAverageYieldPercent = marketAverageYieldPercent;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }

    public double getAnnualRent() {
        return annualRent;
    }

    public void setAnnualRent(double annualRent) {
        this.annualRent = annualRent;
    }

    public double getEstimatedPropertyValue() {
        return estimatedPropertyValue;
    }

    public void setEstimatedPropertyValue(double estimatedPropertyValue) {
        this.estimatedPropertyValue = estimatedPropertyValue;
    }

    public double getGrossRentalYieldPercent() {
        return grossRentalYieldPercent;
    }

    public void setGrossRentalYieldPercent(double grossRentalYieldPercent) {
        this.grossRentalYieldPercent = grossRentalYieldPercent;
    }

    public double getNetRentalYieldPercent() {
        return netRentalYieldPercent;
    }

    public void setNetRentalYieldPercent(double netRentalYieldPercent) {
        this.netRentalYieldPercent = netRentalYieldPercent;
    }

    public double getMarketAverageYieldPercent() {
        return marketAverageYieldPercent;
    }

    public void setMarketAverageYieldPercent(double marketAverageYieldPercent) {
        this.marketAverageYieldPercent = marketAverageYieldPercent;
    }
}
