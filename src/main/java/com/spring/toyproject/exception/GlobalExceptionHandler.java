package com.spring.toyproject.exception;

import com.spring.toyproject.exception.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * 전역 예외처리 핸들러
 * 애플리케이션에서 발생하는 모든 예외를 일관된 형식으로 처리
 */
@Slf4j
@RestControllerAdvice // AOP : 관점지향 프로그래밍
public class GlobalExceptionHandler {

    /**
     * 우리 앱에서 발생한 커스텀 예외들을 처리
     * @ExceptionHandler - 우리 앱에서 throw된 에러들을 처리할 예외클래스
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusinessException(
            BusinessException e
            , HttpServletRequest request
    ) {
        log.warn("비즈니스 예외 발생: {}", e.getMessage());

        // 에러 응답객체 생성
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .detail(e.getMessage())
                .path(request.getRequestURI())
                .status(e.getErrorCode().getStatus())
                .error(e.getErrorCode().getCode())
                .build();

        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(errorResponse);
    }
}
