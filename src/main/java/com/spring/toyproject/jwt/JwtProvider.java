package com.spring.toyproject.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 토큰 생성, 검증, 파싱 기능 제공 유틸클래스
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtProvider {

    private final JwtProperties jwtProperties;

    /**
     * JWT 토큰을 발급하는 메서드
     * @param username - 발급대상의 사용자 이름 (유일하게 사용자를 식별할 값)
     * @return - JWT 토큰 문자열 (암호화됨)
     */
    public String generateToken(String username) {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getExpiration());

        return Jwts.builder()
                .setSubject(username) // 이 토큰을 유일하게 식별할 키
                .issuedAt(now) // 언제 발급했는지
                .expiration(expiryDate) // 언제 만료되는지
                .issuer("Toy Project By SDJ") // 발급자 정보
                .signWith(getSigningKey()) // 서명
                .compact();
    }

    /**
     * JWT 토큰 발급에 필요한 서명 만들기
     * @return - 서명 키 객체
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }
}
