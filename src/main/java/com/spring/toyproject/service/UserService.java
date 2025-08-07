package com.spring.toyproject.service;


import com.spring.toyproject.domain.dto.request.LoginRequest;
import com.spring.toyproject.domain.dto.request.SignUpRequest;
import com.spring.toyproject.domain.dto.response.AuthResponse;
import com.spring.toyproject.domain.dto.response.UserResponse;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.exception.BusinessException;
import com.spring.toyproject.exception.ErrorCode;
import com.spring.toyproject.jwt.JwtProvider;
import com.spring.toyproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 모듈 서비스 클래스
 * 인증, 회원관련 비즈니스 로직 처리
 * 트랜잭션 처리
 */
@Transactional
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    // 비밀번호 암호화를 위한 객체
    private final PasswordEncoder passwordEncoder;

    // JWT 토큰을 발급하는 객체
    private final JwtProvider jwtProvider;

    /**
     * 회원 가입 로직
     */
    public UserResponse signup(SignUpRequest requestDto) {

        // 사용자명 중복 체크
        if (userRepository.existsByUsername(requestDto.getUsername())) {
            throw new BusinessException(ErrorCode.DUPLICATE_USERNAME);
        }
        // 이메일 중복 체크
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 패스워드를 해시로 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        // dto를 entity로 변경
        User user = User.builder()
                .email(requestDto.getEmail())
                .username(requestDto.getUsername())
                .password(encodedPassword)
                .build();

        // db에 INSERT 명령
        User saved = userRepository.save(user);
        log.info("새로운 사용자 가입: {}", saved);

        return UserResponse.from(saved);
    }

    /**
     * 로그인 로직
     */
    public AuthResponse authenticate(LoginRequest loginRequest) {

        // 사용자 조회 (사용자명인지 이메일인지 아직 모름)
        String inputAccount = loginRequest.getUsernameOrEmail();
        User user = userRepository.findByUsername(inputAccount)
                .orElseGet(() -> userRepository.findByEmail(inputAccount)
                        .orElseThrow(
                                () -> new BusinessException(ErrorCode.USER_NOT_FOUND)
                        )
                );

        // 비밀번호 검증
        // 사용자가 입력한 패스워드 ( 평문 )
        String inputPassword = loginRequest.getPassword();

        // DB에 저장된 패스워드 ( 암호문 )
        String storedPassword = user.getPassword();

        // 평문을 다시 해시화해서 암호화한후 비교
        if (!passwordEncoder.matches(inputPassword, storedPassword)) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        // 로그인 성공시 해야할 로직
        String token = jwtProvider.generateToken(user.getUsername());
        log.info("사용자 로그인: {}", user.getUsername());

        // 발급 후? -> 클라이언트에게 전송
        return AuthResponse.of(token, UserResponse.from(user));
    }




}
