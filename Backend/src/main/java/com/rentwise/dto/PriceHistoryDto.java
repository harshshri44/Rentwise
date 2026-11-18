package com.rentwise.dto;

public class PriceHistoryDto {
    private String recordedAt;
    private double rentAmount;
    private String event; // "LISTED", "PRICE_DROP", "PRICE_INCREASE", "STATUS_CHANGE"

    public PriceHistoryDto() {}

    public PriceHistoryDto(String recordedAt, double rentAmount, String event) {
        this.recordedAt = recordedAt;
        this.rentAmount = rentAmount;
        this.event = event;
    }

    public String getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(String recordedAt) {
        this.recordedAt = recordedAt;
    }

    public double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }
}
