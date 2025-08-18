package com.spring.toyproject.domain.dto.request;

import com.spring.toyproject.domain.entity.TagCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagRequestDto {

    @NotBlank(message = "태그명은 필수입니다.")
    private String name;

    @NotNull(message = "카테고리는 필수입니다.")
    private TagCategory category;

    // #RRGGBB 형식
    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "색상은 #RRGGBB 형식이어야 합니다.")
    private String color;
}

