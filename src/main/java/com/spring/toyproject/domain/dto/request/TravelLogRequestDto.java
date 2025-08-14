package com.spring.toyproject.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * 여행일지 생성/수정 요청 DTO
 * 클라이언트로부터 여행일지 정보를 받기 위한 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelLogRequestDto {

    @NotBlank(message = "여행일지 제목은 필수입니다.")
    @Size(max = 100, message = "여행일지 제목은 100자를 초과할 수 없습니다.")
    private String title;

    @Size(max = 2000, message = "여행일지 내용은 2000자를 초과할 수 없습니다.")
    private String content;

    @NotNull(message = "여행일지 날짜는 필수입니다.")
    private LocalDate logDate;

    @Size(max = 100, message = "위치는 100자를 초과할 수 없습니다.")
    private String location;

    // 날씨는 UI에서 사용하지 않아 제거

    @Size(max = 50, message = "기분은 50자를 초과할 수 없습니다.")
    private String mood;

    private Long expenses;

    private Integer rating; // 1-5점 평점

    // 선택된 태그 ID 목록 (옵션)
    private List<Long> tagIds;

    // 비즈니스 검증 메서드
    public boolean isValidRating() {
        return rating == null || (rating >= 1 && rating <= 5);
    }

    public boolean isValidExpenses() {
        return expenses == null || expenses >= 0;
    }

    public boolean isValidLogDate() {
        if (logDate == null) {
            return false;
        }
        // 과거 날짜만 허용 (미래 날짜는 제한)
        LocalDate today = LocalDate.now();
        return !logDate.isAfter(today);
    }
}

