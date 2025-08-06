package com.spring.toyproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 설정 클래스
 * 인증 설정 및 기본 보안 규칙 설정
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 기본 인증 옵션 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // CSRF 공격 설정 off - JWT 인증방식 방해
                .csrf(AbstractHttpConfigurer::disable)
                // CORS 설정 off - 우리가 따로 나중에 수동설정
                .cors(cors-> cors.configure(http))
                // 세션 관리 설정을 JWT에 맞게 함
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 로그인 기본 폼 제거
                .formLogin(AbstractHttpConfigurer::disable)
                // 기본 인증 비활성화
                .httpBasic(AbstractHttpConfigurer::disable)
                ;

        return http.build();

    }
}
