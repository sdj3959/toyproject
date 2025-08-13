package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.common.ApiResponse;
import com.spring.toyproject.domain.dto.request.TripRequest;
import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}