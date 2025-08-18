package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.common.ApiResponse;
import com.spring.toyproject.domain.dto.request.TagRequestDto;
import com.spring.toyproject.domain.dto.response.TagResponseDto;
import com.spring.toyproject.domain.entity.TagCategory;
import com.spring.toyproject.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        TagResponseDto tag = tagService.createTag(requestDto);

        return ResponseEntity.ok().body(
                ApiResponse.success("생성된 tag-id: %s".formatted(tag.getId()), tag)
        );
    }

    /**
     * 카테고리로 해시태그 목록을 조회하는 API
     * GET /api/tags?category={category}
     */
    @GetMapping
    public ResponseEntity<?> getTagsByCategory(@RequestParam(name = "category") TagCategory category) {
        List<TagResponseDto> list = tagService.getTagsByCategory(category);
        return ResponseEntity.ok(
                ApiResponse.success("해시태그 목록이 조회됨", list)
        );
    }
}
