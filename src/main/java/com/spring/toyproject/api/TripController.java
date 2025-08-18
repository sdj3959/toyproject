package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.common.ApiResponse;
import com.spring.toyproject.domain.dto.request.TripRequest;
import com.spring.toyproject.domain.dto.request.TripSearchRequestDto;
import com.spring.toyproject.domain.dto.response.TripDetailDto;
import com.spring.toyproject.domain.dto.response.TripListItemDto;
import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import com.spring.toyproject.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    /**
     * 여행 생성 API
     * POST /api/trips
     */
    @PostMapping
    public ResponseEntity<?> createTrip(
            @RequestBody @Valid TripRequest request
            // 스프링 시큐리티 컨텍스트에서 인증된 사용자의 정보를 가져옴
            , @AuthenticationPrincipal String username
    ) {
        log.info("여행 생성 API 호출 - 사용자: {}", username);

        Trip response = tripService.createTrip(request, username);

        return ResponseEntity.ok()
                .body(
                        ApiResponse.success(
                                "여행이 성공적으로 생성되었습니다."
                                , response
                        )
                );
    }

    /**
     * 사용자별 여행 목록 조회 API (동적 쿼리)
     * GET /api/trips
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TripListItemDto>>> getUserTrips(
            @AuthenticationPrincipal String username,
            TripSearchRequestDto request) {

        log.info("사용자별 여행 목록 조회 API 호출 - 사용자: {}, 페이지: {}, 크기: {}",
                username, request.getPage(), request.getSize());


        TripRepositoryCustom.TripSearchCondition condition = request.toCondition();
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        Page<TripListItemDto> trips = tripService.getUserTripsList(username, condition, pageable);

        return ResponseEntity.ok(ApiResponse.success("여행 정보 목록이 조회되었습니다.", trips));
    }

    /**
     * 여행 단건 조회 API
     * GET /api/trips/{tripId}
     */
    @GetMapping("/{tripId}")
    public ResponseEntity<?> getTrip(
            @PathVariable Long tripId
            , @AuthenticationPrincipal String username
    ) {

        log.info("여행 단건 조회 API 호출 - 사용자: {}, 여행 ID: {}", username, tripId);

        TripDetailDto trip = tripService.getTrip(username, tripId);

        return ResponseEntity.ok().body(
                ApiResponse.success("여행(id: $s) 단일 조회 되었습니다.".formatted(tripId), trip)
        );
    }

}