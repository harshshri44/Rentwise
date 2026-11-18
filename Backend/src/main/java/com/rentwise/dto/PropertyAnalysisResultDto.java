package com.rentwise.dto;

public class PropertyAnalysisResultDto {
    private String propertyId;
    private double fairMarketRent;
    private double askingRent;
    private double variancePercentage;
    private String valuationStatus; // "Underpriced" | "Fair Price" | "Overpriced"
    private double confidenceScore;
    private String summary;
    private RentRange suggestedRentRange;

    public static class RentRange {
        private double min;
        private double max;

        public RentRange() {}

        public RentRange(double min, double max) {
            this.min = min;
            this.max = max;
        }

        public double getMin() {
            return min;
        }

        public void setMin(double min) {
            this.min = min;
        }

        public double getMax() {
            return max;
        }

        public void setMax(double max) {
            this.max = max;
        }
    }

    public PropertyAnalysisResultDto() {}

    public PropertyAnalysisResultDto(String propertyId, double fairMarketRent, double askingRent, double variancePercentage, String valuationStatus, double confidenceScore, String summary, RentRange suggestedRentRange) {
        this.propertyId = propertyId;
        this.fairMarketRent = fairMarketRent;
        this.askingRent = askingRent;
        this.variancePercentage = variancePercentage;
        this.valuationStatus = valuationStatus;
        this.confidenceScore = confidenceScore;
        this.summary = summary;
        this.suggestedRentRange = suggestedRentRange;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }

    public double getFairMarketRent() {
        return fairMarketRent;
    }

    public void setFairMarketRent(double fairMarketRent) {
        this.fairMarketRent = fairMarketRent;
    }

    public double getAskingRent() {
        return askingRent;
    }

    public void setAskingRent(double askingRent) {
        this.askingRent = askingRent;
    }

    public double getVariancePercentage() {
        return variancePercentage;
    }

    public void setVariancePercentage(double variancePercentage) {
        this.variancePercentage = variancePercentage;
    }

    public String getValuationStatus() {
        return valuationStatus;
    }

    public void setValuationStatus(String valuationStatus) {
        this.valuationStatus = valuationStatus;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public RentRange getSuggestedRentRange() {
        return suggestedRentRange;
    }

    public void setSuggestedRentRange(RentRange suggestedRentRange) {
        this.suggestedRentRange = suggestedRentRange;
    }
}
