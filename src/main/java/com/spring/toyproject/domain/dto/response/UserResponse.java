package com.spring.toyproject.domain.dto.response;

import com.spring.toyproject.domain.entity.User;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 회원가입 직후 또는 마이페이지에서 렌더링에 사용할 JSON 응답 객체
 */
@Getter
@Builder
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private LocalDateTime createdAt;

    /**
     * User 엔티티를 UserResponseDto로 변환
     */
    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
