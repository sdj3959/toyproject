package com.spring.toyproject.domain.dto.response;

import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 여행 상세 페이지 전용 Compact DTO
 * trip-detail 페이지에서 실제 사용하는 필드만 포함
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDetailDto {

    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private TripStatus status;
    private String statusDescription;
    private TripStatusInfo statusInfo;
    private String destination;
    private Long budget;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TripDetailDto from(Trip trip) {
        return TripDetailDto.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .description(trip.getDescription())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .status(trip.getStatus())
                .statusDescription(trip.getStatus().getDescription())
                .statusInfo(TripStatusInfo.from(trip.getStatus()))
                .destination(trip.getDestination())
                .budget(trip.getBudget())
                .createdAt(trip.getCreatedAt())
                .updatedAt(trip.getUpdatedAt())
                .build();
    }
}
