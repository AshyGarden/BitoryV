package com.spring.jpa.userapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
@Builder @Entity
@Table(name = "MBRINFM")
public class user {
    @Id
    @Column(name = "MBR_ID", length = 50)
    private String mbrId; //ID

    @Column(name = "MBR_PW",nullable = false, length = 40)
    private String mbrPw; //PW

    @Column(name = "MBR_BDG", nullable = false)
    private float mbrBdg; //회원의 원화자산

}
