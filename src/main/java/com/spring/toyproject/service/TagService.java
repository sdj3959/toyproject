package com.spring.toyproject.service;


import com.spring.toyproject.domain.dto.request.TagRequestDto;
import com.spring.toyproject.domain.dto.response.TagResponseDto;
import com.spring.toyproject.domain.entity.Tag;
import com.spring.toyproject.domain.entity.TagCategory;
import com.spring.toyproject.exception.BusinessException;
import com.spring.toyproject.exception.ErrorCode;
import com.spring.toyproject.repository.base.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    // 해시 태그 생성 처리
    public TagResponseDto createTag(TagRequestDto requestDto) {

        // 멱등 처리 (race condition 처리)
        // 혹시나 프론트에서 당연히 한 번 중복을 검증하지만 서버에서 한 번 더 검증
        if (tagRepository.existsByName(requestDto.getName())) {
            throw new BusinessException(ErrorCode.HASHTAG_EXISTS);
        }

        // 태그 엔터티 생성
        Tag tag = Tag.builder()
                .name(requestDto.getName())
                .category(requestDto.getCategory())
                .color(requestDto.getColor())
                .build();

        // 생성된 이후에 ID가 필요하다.
        Tag savedTag = tagRepository.save(tag);
        // 클라이언트에게 ID가 포함된 정보를 리턴
        return TagResponseDto.from(savedTag);
    }

    // 카테고리로 해시태그 목록 가져오기
    @Transactional(readOnly = true)
    public List<TagResponseDto> getTagsByCategory(TagCategory category) {

        return tagRepository.findByCategoryOrderByName(category).stream()
                .map(TagResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 검색어가 포함된 해시태그 목록을 가져오기
     */
    @Transactional(readOnly = true)
    public List<TagResponseDto> searchTags(String keyword) {
        /*
            SELECT *
            FROM tags
            WHERE name LIKE '%keyword%'
         */
        return tagRepository.findByNameContaining(keyword)
                .stream()
                .map(TagResponseDto::from)
                .collect(Collectors.toList())
                ;
    }
}
