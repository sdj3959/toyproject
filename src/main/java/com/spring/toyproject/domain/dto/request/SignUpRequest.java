package com.spring.toyproject.domain.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * 회원 가입 요청에 사용할 DTO
 * - 클라이언트로부터 회원가입폼에서 작성한 데이터를 받고 검증하는 객체
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignUpRequest {

    // 필드명은 클라이언트가 전송할 때 사용할 JSON의 key가 되니 프론트개발자와 협업
    @NotBlank(message = "사용자명은 필수입니다.")
    @Size(min = 3, max = 15, message = "사용자명은 3자 이상 15자 이하여야 합니다.")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.")
    private String username;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 6, max = 20, message = "비밀번호는 6자 이상 20자 이하여야 합니다.")
    private String password;

}
