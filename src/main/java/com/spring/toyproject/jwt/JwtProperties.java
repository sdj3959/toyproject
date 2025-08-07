package com.spring.toyproject.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * JWT 설정 읽기 파일 - application.yml의 jwt.xxx 값을 읽어오는 클래스
 */
@Setter @Getter
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret; // jwt.secret을 읽어들임
    private Long expiration; // jwt.expiration을 읽어들임
}
