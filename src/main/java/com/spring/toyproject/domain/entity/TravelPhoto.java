package com.spring.toyproject.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/*
    DB에 실제 사진을 저장하느냐??
    NO! DB자체에 저장할 유인이 적다.
    -> 실제 파일은 다른 컴퓨터(클라우드 서비스)에 저장
    DB에는 해당 파일을 찾기 쉽게 파일의 메타데이터(실제저장경로, 파일명)만 저장
 */
@Entity
@Table(name = "travel_photos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TravelPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "stored_filename", nullable = false)
    private String storedFilename;  // 저장된 파일명 (해시암호화)

    @Column(name = "original_filename", nullable = false)
    private String originalFilename; // 원본 파일명 (나중에 다운로드 받을때 이걸로 재변경)

    @Column(name = "file_path", nullable = false)
    private String filePath; // 파일이 실제 저장된 경로

    // 정렬 순서(대표 사진 선정을 위해 1부터 시작 권장)
    @Column(name = "display_order")
    private Integer displayOrder;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "travel_log_id", nullable = false)
    private TravelLog travelLog;

    @Builder
    public TravelPhoto(TravelLog travelLog, String storedFilename, String originalFilename, String filePath, Integer displayOrder) {
        this.travelLog = travelLog;
        this.storedFilename = storedFilename;
        this.originalFilename = originalFilename;
        this.filePath = filePath;
        this.displayOrder = displayOrder;
    }
}