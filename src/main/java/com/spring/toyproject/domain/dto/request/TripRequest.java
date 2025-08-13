package com.spring.toyproject.domain.dto.request;

import com.spring.toyproject.domain.entity.TripStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripRequest {

    @NotBlank(message = "여행 제목은 필수입니다.")
    @Size(max = 100, message = "여행 제목은 100자를 초과할 수 없습니다.")
    private String title;

    @Size(max = 1000, message = "여행 설명은 1000자를 초과할 수 없습니다.")
    private String description;

    @NotNull(message = "시작 날짜는 필수입니다.")
    private LocalDate startDate;

    @NotNull(message = "종료 날짜는 필수입니다.")
    private LocalDate endDate;

    private TripStatus status;

    @Size(max = 100, message = "목적지는 100자를 초과할 수 없습니다.")
    private String destination;

    private Long budget;
}
