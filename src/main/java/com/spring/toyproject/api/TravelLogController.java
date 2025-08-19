package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.common.ApiResponse;
import com.spring.toyproject.domain.dto.request.TravelLogRequestDto;
import com.spring.toyproject.domain.dto.response.TagResponseDto;
import com.spring.toyproject.domain.dto.response.TravelLogResponseDto;
import com.spring.toyproject.repository.custom.TravelLogRepositoryCustom;
import com.spring.toyproject.service.TravelLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/travel-logs")
public class TravelLogController {

    private final TravelLogService travelLogService;

    /**
     * 여행일지 생성 API
     * POST /api/travel-logs
     *
     * consumes : 클라이언트가 보낸 데이터의 형태 (기본값: json)
     * produces : 서버가 응답할 때 보내는 데이터 (기본값: json)
     */
    @PostMapping
    public ResponseEntity<?> createTravelLogs(
            @RequestParam Long tripId
            , @RequestPart(name = "data") @Valid TravelLogRequestDto requestDto
            , @RequestPart(name = "files") List<MultipartFile> files
            , @AuthenticationPrincipal String username
    ) {
        log.info("여행 일지 생성 API 호출 - 사용자: {}, 여행ID: {}", username, tripId);
        for (MultipartFile file : files) {
            log.info("첨부된 파일명: {}", file.getOriginalFilename());
        }

        travelLogService.createTravelLog(requestDto, tripId, username, files);

        return ResponseEntity.ok()
                .body(ApiResponse.success("여행일지가 성공적으로 생성되었습니다.", null));
    }

    /**
     * 여행일지 목록조회 API
     * GET /api/travel-logs
     */
    @GetMapping
    public ResponseEntity<?> getTravelLogs(
            @AuthenticationPrincipal String username,
            @RequestParam(name = "tripId", required = false) Long tripId,
            @RequestParam(name = "location", required = false) String location,
            @RequestParam(name = "logDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        log.info("여행일지 목록 조회 API 호출 - 사용자: {}, 여행 ID: {}, 페이지: {}, 크기: {}",
                username, tripId, page, size);


        // 검색 조건 구성
        TravelLogRepositoryCustom.TravelLogSearchCondition condition =
                TravelLogRepositoryCustom.TravelLogSearchCondition.builder()
                        .location(location)
                        .logDate(logDate)
                        .build();

        Pageable pageable = PageRequest.of(page, size);
        Page<TravelLogResponseDto> travelLogs = travelLogService.getTravelLogsByTrip(username, tripId, condition, pageable);

        return ResponseEntity.ok(ApiResponse.success("", travelLogs));
    }

    /**
     * 여행일지 상세 조회 API
     * GET /api/travel-logs/{travelLogId}
     */
    @GetMapping("/{travelLogId}")
    public ResponseEntity<?> getTravelLogDetail(
            @AuthenticationPrincipal String username,
            @PathVariable(name = "travelLogId") Long travelLogId) {

        log.info("여행일지 상세 조회 API 호출 - 사용자: {}, 여행일지 ID: {}", username, travelLogId);

        TravelLogResponseDto travelLogDetail = travelLogService.getTravelLogDetail(username, travelLogId);

        return ResponseEntity.ok(ApiResponse.success("", travelLogDetail));
    }

    /**
     * 여행 일지 단건 조회시 해시태그 목록 조회 API
     * GET /api/travel-logs/{id}/tags
     */
    @GetMapping("/{travelLogId}/tags")
    public ResponseEntity<?> getTags(
            @AuthenticationPrincipal String username
            , @PathVariable Long travelLogId
    ) {
        List<TagResponseDto> responses = travelLogService.getTagsByTravelLog(username, travelLogId);
        return ResponseEntity.ok(ApiResponse.success("", responses));
    }
}