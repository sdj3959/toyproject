package com.spring.toyproject.domain.dto.response;

import com.spring.toyproject.domain.entity.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripStatusInfo {

    private TripStatus status;
    private String description;
    private String color;
    private String icon;

    /**
     * TripStatus enum으로부터 TripStatusInfo 생성
     */
    public static TripStatusInfo from(TripStatus status) {
        String color = switch (status) {
            case PLANNING -> "warning";
            case ONGOING -> "primary";
            case COMPLETED -> "success";
            case CANCELLED -> "danger";
        };

        String icon = switch (status) {
            case PLANNING -> "bi-calendar-check";
            case ONGOING -> "bi-airplane";
            case COMPLETED -> "bi-check-circle";
            case CANCELLED -> "bi-x-circle";
        };

        return TripStatusInfo.builder()
                .status(status)
                .description(status.getDescription())
                .color(color)
                .icon(icon)
                .build();
    }
}