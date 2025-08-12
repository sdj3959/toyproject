package com.spring.toyproject.repository.custom;

import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.TripStatus;
import com.spring.toyproject.domain.entity.User;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * QueryDSL과 Native Query등을 사용하는 메서드를 명세하는 인터페이스
 */
public interface TripRepositoryCustom {

    // 동적 쿼리로 조건별 여행 목록 조회 메서드 (페이징 포함)
    Page<Trip> findTripsByUser(User user, TripSearchCondition condition, Pageable pageable);


    /**
     * 여행 검색 조건들을 담는 클래스
     */
    @Getter
    @Builder
    class TripSearchCondition {
        private TripStatus status;  // 여행 상태로 검색
        private String destination; // 목적지로 검색
        private String title;       // 제목으로 검색

        // 정렬 조건
        @Builder.Default
        private String sortBy = "createdAt"; // createdAt, startDate, endDate, budget, title

        // 내림차 오름차 여부
        @Builder.Default
        private String sortDirection = "DESC"; // ASC, DESC
    }
}
