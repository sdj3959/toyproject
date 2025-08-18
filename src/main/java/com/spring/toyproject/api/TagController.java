package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.common.ApiResponse;
import com.spring.toyproject.domain.dto.request.TagRequestDto;
import com.spring.toyproject.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 해시태그 관련 API
 */
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    // 해시태그 등록
    @PostMapping
    public ResponseEntity<?> createTag(
            @RequestBody @Valid TagRequestDto requestDto
    ) {

        tagService.createTag(requestDto);

        return ResponseEntity.ok().body(
                ApiResponse.success("", null)
        );
    }
}
