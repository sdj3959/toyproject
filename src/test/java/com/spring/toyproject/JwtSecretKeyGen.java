package com.spring.toyproject;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.security.SecureRandom;
import java.util.Base64;

public class JwtSecretKeyGen {

    @Test
    @DisplayName("서버 비밀키 생성")
    void generatekey() {
        // 256비트(32바이트) 키 생성
        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[32];
        secureRandom.nextBytes(key);

        // Base64로 인코딩
        String secretKey = Base64.getEncoder().encodeToString(key);
        System.out.println("JWT Secret Key: " + secretKey);
    }

}
