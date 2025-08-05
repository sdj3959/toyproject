package com.spring.toyproject.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/*
    사용자 엔터티
    - 인증 시스템의 핵심 엔터티로 기본 사용자 정보관리
 */
@Entity
@Table(name = "tbl_user")

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "user_name", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "user_email", unique = true, nullable = false, length = 100)
    private String email;

    // 패스워드는 사용자가 지정한 길이가 8~20자여도 결국 DB에는 암호화되어서 해시로 들어간다.
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    // 모든 테이블에는 생성시간과 마지막 수정시간이 필수
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // AllArgs 대신에 따로 생성자를 하나 만듦
    @Builder
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
