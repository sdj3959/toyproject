package com.spring.toyproject.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외처리 핸들러
 * 애플리케이션에서 발생하는 모든 예외를 일관된 형식으로 처리
 */
@Slf4j
@RestControllerAdvice // AOP : 관점지향 프로그래밍
public class GlobalExceptionHandler {

    /**
     * 우리 앱에서 발행산 커스텀 예외들을 처리
     * @ExceptionHandler - 우리 앱에서 throw된 에러들을 처리할 예외클래스
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusinessException(BusinessException e) {
        log.warn("비즈니스 예외 발생: {}", e.getMessage());

        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
