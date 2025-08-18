package com.spring.toyproject.domain.dto.response;

import com.spring.toyproject.domain.entity.Tag;
import com.spring.toyproject.domain.entity.TagCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagResponseDto {

    private Long id;
    private String name;
    private TagCategory category;
    private String color;

    public static TagResponseDto from(Tag tag) {
        return TagResponseDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .category(tag.getCategory())
                .color(tag.getDisplayColor())
                .build();
    }
}
