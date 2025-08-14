package com.spring.toyproject.domain.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 여행 엔터티
 * 사용자와 1:N 관계를 가지며, 여행의 기본정보를 관리
 */
@Entity
@Table(name = "trips")
@Getter
@ToString(exclude = {"user"})
@NoArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_id")
    private Long id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TripStatus status = TripStatus.PLANNING;

    @Column(name = "budget")
    private Long budget;

    @Column(name = "destination", length = 100)
    private String destination;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 여행일지와의 1:N 관계
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TravelLog> travelLogs = new ArrayList<>();

    @Builder
    public Trip(String title, String description, LocalDate startDate, LocalDate endDate, TripStatus status, String destination, Long budget, User user) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status != null? status : TripStatus.PLANNING;
        this.destination = destination;
        this.budget = budget;
        this.user = user;
    }

    // 비즈니스 메서드
    public void updateTrip(String title, String description, LocalDate startDate,
                           LocalDate endDate, TripStatus status, Long budget, String destination) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.budget = budget;
        this.destination = destination;
    }

    public void updateStatus(TripStatus status) {
        this.status = status;
    }

    // 여행 기간 계산
    public int getDuration() {
        if (startDate != null && endDate != null) {
            return (int) startDate.until(endDate).getDays() + 1;
        }
        return 0;
    }

    // 여행이 진행 중인지 확인
    public boolean isOngoing() {
        return status == TripStatus.ONGOING;
    }

    // 여행이 완료되었는지 확인
    public boolean isCompleted() {
        return status == TripStatus.COMPLETED;
    }
}
