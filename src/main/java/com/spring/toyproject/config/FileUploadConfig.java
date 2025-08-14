package com.spring.toyproject.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
@Getter
@Setter
public class FileUploadConfig {

    @Value("${file.upload.location}")
    private String location;

    @PostConstruct
    public void init() {
        File directory = new File(location);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }
}
