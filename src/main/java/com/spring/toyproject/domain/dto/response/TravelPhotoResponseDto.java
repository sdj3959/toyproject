package com.spring.toyproject.domain.dto.response;

import com.spring.toyproject.domain.entity.TravelPhoto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelPhotoResponseDto {
    private Long id;
    private String url;
    // 렌더링에 불필요한 메타는 제외 (필요시 확장)

    public static TravelPhotoResponseDto from(TravelPhoto photo) {
        return TravelPhotoResponseDto.builder()
                .id(photo.getId())
                .url(photo.getFilePath())
                .build();
    }
}