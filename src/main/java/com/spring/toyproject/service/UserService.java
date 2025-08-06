package com.spring.toyproject.service;


import com.spring.toyproject.domain.dto.request.SignUpRequest;
import com.spring.toyproject.domain.dto.response.UserResponse;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    /**
     * 회원 가입 로직
     */
    public UserResponse signup(SignUpRequest requestDto) {

        // dto를 entity로 변경
        User user = User.builder()
                .email(requestDto.getEmail())
                .username(requestDto.getUsername())
                .password(requestDto.getPassword())
                .build();

        // db에 INSERT 명령
        User saved = userRepository.save(user);
        log.info("새로운 사용자 가입: {}", saved);

        return UserResponse.from(saved);
    }

}
