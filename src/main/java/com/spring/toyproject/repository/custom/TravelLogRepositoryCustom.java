package com.spring.toyproject.repository.custom;


import com.spring.toyproject.domain.entity.TravelLog;
import com.spring.toyproject.domain.entity.Trip;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

/**
 * TravelLogRepository 커스텀 인터페이스
 * QueryDSL과 Native Query를 사용하는 메서드들을 정의
 */
public interface TravelLogRepositoryCustom {

    // 여행별 여행일지 조회 메서드 (페이징 포함)
    Page<TravelLog> findTravelLogsByTrip(Trip trip, TravelLogSearchCondition condition, Pageable pageable);

    // 사용자 기준(모든 여행 포함) 여행일지 조회 메서드 (페이징 포함)
    Page<TravelLog> findTravelLogsByUserId(Long userId, TravelLogSearchCondition condition, Pageable pageable);

    // 통합 검색: 사용자 기준 키워드로 여행일지 검색 (제목/내용/위치/태그명)
    Page<TravelLog> searchUserTravelLogs(Long userId, String keyword, Pageable pageable);

    // 여행별 여행일지 통계 조회
    long countByTrip(Trip trip);

    // 여행별 평균 평점 조회 (Native Query 사용)
    Double getAverageRatingByTrip(Trip trip);

    // 여행별 총 지출 조회 (Native Query 사용)
    Long getTotalExpensesByTrip(Trip trip);

    // 사용자별 전체 여행일지 수
    long countByUserId(Long userId);

    // 사용자별 평균 평점
    Double getAverageRatingByUserId(Long userId);

    // 사용자별 총 지출
    Long getTotalExpensesByUserId(Long userId);

    // 사용자별 모든 여행일지 조회 (여행을 통해)
    List<TravelLog> findByUserIdOrderByLogDateDesc(Long userId);

    // 사용자별 특정 날짜의 모든 여행일지 조회
    List<TravelLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    /**
     * 여행일지 검색 조건을 담는 클래스
     */
    @Getter
    @Builder
    class TravelLogSearchCondition {
        private LocalDate logDate;
        private LocalDate startDate;
        private LocalDate endDate;
        private String location;
        private String mood;
        private String title;
        private String content;
        private Integer minRating;
        private Boolean hasExpenses;

        @Builder.Default
        private String sortBy = "logDate"; // logDate, createdAt, rating, expenses

        @Builder.Default
        private String sortDirection = "ASC"; // ASC, DESC

    }
}

