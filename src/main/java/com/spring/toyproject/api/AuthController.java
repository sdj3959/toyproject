package com.spring.toyproject.api;

import com.spring.toyproject.domain.dto.request.SignUpRequest;
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

        userService.signup(requestDto);

        return ResponseEntity.ok().body("회원가입 완료!");
    }
}
