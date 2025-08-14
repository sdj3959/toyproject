package com.spring.toyproject.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

/**
 * 태그 엔티티
 * 여행일지에 붙일 수 있는 태그를 관리
 */
@Entity
@Table(name = "tags")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, length = 50, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private TagCategory category;

    @Column(name = "color", length = 7) // #RRGGBB 형식
    private String color;

    @Column(name = "description", length = 200)
    private String description;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Tag(String name, TagCategory category, String color, String description) {
        this.name = name;
        this.category = category;
        this.color = color;
        this.description = description;
    }

    /**
     * 색상이 설정되지 않은 경우 기본 색상 반환
     */
    public String getDisplayColor() {
        return color != null ? color : "#6c757d"; // 기본 회색
    }
}