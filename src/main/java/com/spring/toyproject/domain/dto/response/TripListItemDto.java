package com.spring.toyproject.domain.dto.response;

import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 여행 목록 전용 응답 DTO
 * /api/trips 목록 화면 렌더링에 필요한 최소 정보만 포함
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripListItemDto {

    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private TripStatus status;
    private String statusDescription;
    private TripStatusInfo statusInfo;
    private String destination;
    private Long budget;
    private int duration;

    public static TripListItemDto from(Trip trip) {
        return TripListItemDto.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .description(trip.getDescription())
                .startDate(trip.getStartDate())
                .status(trip.getStatus())
                .statusDescription(trip.getStatus().getDescription())
                .statusInfo(TripStatusInfo.from(trip.getStatus()))
                .destination(trip.getDestination())
                .budget(trip.getBudget())
                .duration(trip.getDuration())
                .build();
    }
}


