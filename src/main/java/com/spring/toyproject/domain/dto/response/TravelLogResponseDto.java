package com.spring.toyproject.domain.dto.response;

import com.spring.toyproject.domain.entity.TravelLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 여행일지 조회 응답 DTO
 * 클라이언트에게 여행일지 정보를 전달하기 위한 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelLogResponseDto {

    private Long id;
    private String title;
    private String content;
    private LocalDate logDate;
    private String location;
    private String mood;
    private Long expenses;
    private Integer rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // 목록/그룹용으로 필요한 최소 Trip 정보만 포함
    private TripListItemDto trip;
    private String coverImageUrl;

    // TravelLog 엔티티로부터 DTO 생성
    public static TravelLogResponseDto from(TravelLog travelLog) {
        return TravelLogResponseDto.builder()
                .id(travelLog.getId())
                .title(travelLog.getTitle())
                .content(travelLog.getContent())
                .logDate(travelLog.getLogDate())
                .location(travelLog.getLocation())
                .mood(travelLog.getMood())
                .expenses(travelLog.getExpenses())
                .rating(travelLog.getRating())
                .createdAt(travelLog.getCreatedAt())
                .updatedAt(travelLog.getUpdatedAt())
                .trip(TripListItemDto.from(travelLog.getTrip()))
                .coverImageUrl(null)
                .build();
    }

    public static TravelLogResponseDto from(TravelLog travelLog, String coverImageUrl) {
        return TravelLogResponseDto.builder()
                .id(travelLog.getId())
                .title(travelLog.getTitle())
                .content(travelLog.getContent())
                .logDate(travelLog.getLogDate())
                .location(travelLog.getLocation())
                .mood(travelLog.getMood())
                .expenses(travelLog.getExpenses())
                .rating(travelLog.getRating())
                .createdAt(travelLog.getCreatedAt())
                .updatedAt(travelLog.getUpdatedAt())
                .trip(TripListItemDto.from(travelLog.getTrip()))
                .coverImageUrl(coverImageUrl)
                .build();
    }

    // 평점이 있는지 확인
    public boolean hasRating() {
        return rating != null && rating >= 1 && rating <= 5;
    }

    // 지출이 있는지 확인
    public boolean hasExpenses() {
        return expenses != null && expenses > 0;
    }

    // 위치 정보가 있는지 확인
    public boolean hasLocation() {
        return location != null && !location.trim().isEmpty();
    }


    // 기분 정보가 있는지 확인
    public boolean hasMood() {
        return mood != null && !mood.trim().isEmpty();
    }

    // 오늘 작성된 여행일지인지 확인
    public boolean isTodayLog() {
        return logDate != null && logDate.equals(LocalDate.now());
    }

    // 최근 7일 내 작성된 여행일지인지 확인
    public boolean isRecentLog() {
        if (logDate == null) {
            return false;
        }
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        return !logDate.isBefore(sevenDaysAgo);
    }

    // 평점별 별점 표시를 위한 메서드
    public String getRatingStars() {
        if (!hasRating()) {
            return "";
        }
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }
}

