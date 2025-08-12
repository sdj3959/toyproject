package com.spring.toyproject.repository.custom;

import com.spring.toyproject.domain.entity.TripStatus;
import lombok.Builder;
import lombok.Getter;

/**
 * 여행 검색 조건들을 담는 클래스
 */
@Getter
@Builder
public class TripSearchCondition {

    private TripStatus status; // 여행 상태로 검색
    private String destination; // 목적지로 검색
    private String title;       // 제목으로 검색

    // 정렬 조건
    @Builder.Default
    private String sortBy = "createdAt"; // createdAt, startDate, endDate, destination, title

    // 내림차 오름차 여부
    @Builder.Default
    private String sortDirection = "DESC"; // ASC, DESC
}
