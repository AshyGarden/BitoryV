package com.spring.jpa.pageapi.api;

public class BuyOrderDto {

    private String coinCode;
    private Double orderPrice;
    private Double orderQuantity;
    private Double totalAmount;

    // 기본 생성자
    public BuyOrderDto() {
    }

    // 매개변수가 있는 생성자
    public BuyOrderDto(String coinCode, Double orderPrice, Double orderQuantity, Double totalAmount) {
        this.coinCode = coinCode;
        this.orderPrice = orderPrice;
        this.orderQuantity = orderQuantity;
        this.totalAmount = totalAmount;
    }

    // Getter와 Setter 메소드
    public String getCoinCode() {
        return coinCode;
    }

    public void setCoinCode(String coinCode) {
        this.coinCode = coinCode;
    }

    public Double getOrderPrice() {
        return orderPrice;
    }

    public void setOrderPrice(Double orderPrice) {
        this.orderPrice = orderPrice;
    }

    public Double getOrderQuantity() {
        return orderQuantity;
    }

    public void setOrderQuantity(Double orderQuantity) {
        this.orderQuantity = orderQuantity;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
