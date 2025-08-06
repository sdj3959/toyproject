package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.common.ApiResponse;
import com.spring.toyproject.domain.dto.request.LoginRequest;
import com.spring.toyproject.domain.dto.request.SignUpRequest;
import com.spring.toyproject.domain.dto.response.UserResponse;
import com.spring.toyproject.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * 회원가입 API
     * POST : /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignUpRequest requestDto) {
        log.info("회원가입 요청: {}", requestDto.getUsername());

        UserResponse response = userService.signup(requestDto);

        return ResponseEntity
                .ok()
                .body(
                        ApiResponse.success("회원가입이 성공적으로 완료되었습니다.", response)
                );

    }

    /**
     * 로그인 API - GET 방식은 URL에 파라미터가 노출될 가능성이 높음
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest requestDto) {
        log.info("로그인 요청: {}", requestDto.getUsernameOrEmail());

        userService.authenticate(requestDto);

        return ResponseEntity.ok().body(
                ApiResponse.success("로그인이 완료되었습니다.", null)
        );
    }
}
