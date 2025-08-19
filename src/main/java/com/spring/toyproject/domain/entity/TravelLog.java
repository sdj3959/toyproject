package com.spring.toyproject.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 여행일지 엔티티
 * 여행과 1:N 관계를 가지며, 여행일지의 상세 정보를 관리
 */
@Entity
@Table(name = "travel_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TravelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "travel_log_id")
    private Long id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "mood", length = 50)
    private String mood;

    @Column(name = "expenses")
    private Long expenses;

    @Column(name = "rating")
    private Integer rating; // 1-5점 평점

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @OneToMany(mappedBy = "travelLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TravelLogTag> travelLogTags = new ArrayList<>();

    @OneToMany(mappedBy = "travelLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TravelPhoto> travelPhotos = new ArrayList<>();


    @Builder
    public TravelLog(Trip trip, String title, String content, LocalDate logDate,
                     String location, String mood, Long expenses, Integer rating) {
        this.trip = trip;
        this.title = title;
        this.content = content;
        this.logDate = logDate;
        this.location = location;
        this.mood = mood;
        this.expenses = expenses;
        this.rating = rating;
    }

    // 비즈니스 메서드
    public void updateTravelLog(String title, String content, LocalDate logDate,
                                String location, String mood, Long expenses, Integer rating) {
        this.title = title;
        this.content = content;
        this.logDate = logDate;
        this.location = location;
        this.mood = mood;
        this.expenses = expenses;
        this.rating = rating;
    }


    // 태그 관련 편의 메서드
    public void addTag(Tag tag) {
        TravelLogTag travelLogTag = TravelLogTag.builder()
                .travelLog(this)
                .tag(tag)
                .build();
        travelLogTags.add(travelLogTag);
    }


}