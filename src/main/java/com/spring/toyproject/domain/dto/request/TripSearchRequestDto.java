package com.spring.toyproject.domain.dto.request;

import com.spring.toyproject.domain.entity.TripStatus;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 여행 목록 조회용 검색 파라미터 DTO
 * GET /api/trips 의 쿼리 파라미터 바인딩에 사용
 */
@Getter
@Setter
@NoArgsConstructor
public class TripSearchRequestDto {

    // 필터
    private String title;
    private String destination;
    private String status; // 대소문자 무관 입력 허용

    // 정렬
    private String sortBy = "createdAt"; // createdAt|startDate|endDate|title|destination
    private String sortDirection = "DESC"; // ASC|DESC

    // 페이징
    private int page = 0;
    private int size = 10;

    /**
     * Repository 검색 조건으로 변환
     * - status는 Enum 변환 시 오류가 나면 무시(null)
     */
    public TripRepositoryCustom.TripSearchCondition toCondition() {
        TripStatus enumStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                enumStatus = TripStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ignore) {
                // 무시: 잘못된 값은 필터에서 제외
            }
        }

        return TripRepositoryCustom.TripSearchCondition.builder()
                .status(enumStatus)
                .destination(destination)
                .title(title)
                .sortBy(sortBy != null ? sortBy : "createdAt")
                .sortDirection(sortDirection != null ? sortDirection : "DESC")
                .build();
    }
}

