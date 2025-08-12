package com.spring.toyproject.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TripStatus {
    PLANNING("계획중"),      // 여행 계획 단계
    ONGOING("진행중"),       // 여행 진행 중
    COMPLETED("완료"),       // 여행 완료
    CANCELLED("취소");       // 여행 취소

    private final String description;
}
