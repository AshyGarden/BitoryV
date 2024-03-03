package com.spring.jpa.pageapi.api;

public class SellOrderDto {

    private String coinCode;
    private Double sellOrderPrice;
    private Double sellOrderQuantity;
    private Double totalAmount;

    // 기본 생성자
    public SellOrderDto() {
    }

    // 매개변수가 있는 생성자
    public SellOrderDto(String coinCode, Double sellOrderPrice, Double sellOrderQuantity, Double totalAmount) {
        this.coinCode = coinCode;
        this.sellOrderPrice = sellOrderPrice;
        this.sellOrderQuantity = sellOrderQuantity;
        this.totalAmount = totalAmount;
    }

    // Getter와 Setter 메소드
    public String getCoinCode() {
        return coinCode;
    }

    public void setCoinCode(String coinCode) {
        this.coinCode = coinCode;
    }

    public Double getSellOrderPrice() {
        return sellOrderPrice;
    }

    public void setSellOrderPrice(Double sellOrderPrice) {
        this.sellOrderPrice = sellOrderPrice;
    }

    public Double getSellOrderQuantity() {
        return sellOrderQuantity;
    }

    public void setSellOrderQuantity(Double sellOrderQuantity) {
        this.sellOrderQuantity = sellOrderQuantity;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
