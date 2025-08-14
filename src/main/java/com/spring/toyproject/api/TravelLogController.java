package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.common.ApiResponse;
import com.spring.toyproject.domain.dto.request.TravelLogRequestDto;
import com.spring.toyproject.service.TravelLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
     * consumes : 클라이언트가 보낸 데이터의 형태 (기본값 : json)
     * produces : 서버가 응답할 때 보내는 데이터 (기본값 : json)
     */
    @PostMapping
    public ResponseEntity<?> createTravelLogs(
            @RequestParam Long tripId
            , @RequestPart(name = "data") @Valid TravelLogRequestDto requestDto
            , @RequestPart(name = "files") List<MultipartFile> files
            , @AuthenticationPrincipal String username
    ) {
        log.info("여행 일지 생성 API 호출 - 사용자 {}, 여행ID: {}", username, tripId);
        for (MultipartFile file : files) {
            log.info("첨부된 파일명: {}", file.getOriginalFilename());
        }

        travelLogService.createTravelLog(requestDto, tripId, username, files);

        return ResponseEntity.ok()
                .body(ApiResponse.success("여행일지가 성공적으로 생성되었습니다", null));
    }
}
