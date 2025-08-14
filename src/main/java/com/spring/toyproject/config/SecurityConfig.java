package com.spring.toyproject.config;

import com.spring.toyproject.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정 클래스
 * 인증 설정 및 기본 보안 규칙 설정
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // 기본 인증 옵션 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // CSRF 공격 설정 off - JWT 인증방식 방해
                .csrf(AbstractHttpConfigurer::disable)
                // CORS 설정 off - 우리가 따로 나중에 수동설정
                .cors(cors -> cors.configure(http))
                // 세션 관리 설정을 JWT에 맞게 함
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                //  로그인 기본 폼 제거
                .formLogin(AbstractHttpConfigurer::disable)
                // 기본 인증 비활성화
                .httpBasic(AbstractHttpConfigurer::disable)


                // 인가 설정
                .authorizeHttpRequests(
                        auth -> auth
                                // 공개 접근 가능한 경로 (로그인 불필요)
                                .requestMatchers(
                                        "/"
                                        , "/login"
                                        , "/signup"
                                        , "/trips/**"
                                        , "/dashboard"
                                ).permitAll()
                                .requestMatchers("/css/**", "/js/**", "/images/**", "/favicon.ico", "/uploads/**").permitAll()
                                .requestMatchers("/api/auth/**").permitAll()

                                // 인증 및 권한이 필요한 경로
//                                .requestMatchers("/api/premium/**").hasAnyAuthority("VIP", "GOLD")
                                .requestMatchers("/api/**").authenticated()

                                // 기타 경로
                                // 모든 다른 요청은 인증이 필요하다
                                .anyRequest().authenticated()
                )


                // 커스텀 필터 설정
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        ;

        return http.build();
    }
}