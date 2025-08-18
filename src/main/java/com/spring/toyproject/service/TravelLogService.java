package com.spring.toyproject.service;

import com.spring.toyproject.config.FileUploadConfig;
import com.spring.toyproject.domain.dto.request.TravelLogRequestDto;
import com.spring.toyproject.domain.entity.*;
import com.spring.toyproject.exception.BusinessException;
import com.spring.toyproject.exception.ErrorCode;
import com.spring.toyproject.repository.base.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class TravelLogService {

    private final FileUploadConfig fileUploadConfig;

    private final TravelLogRepository travelLogRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TravelPhotoRepository travelPhotoRepository;
    private final TagRepository tagRepository;

    /**
     * 여행일지 생성
     */
    public void createTravelLog(TravelLogRequestDto request, Long tripId, String username, List<MultipartFile> imageFiles) {
        log.info("여행 일지 생성 시작 - 사용자명: {}, 제목: {}, 여행ID: {}", username, request.getTitle(), tripId);

        // 사용자 조회
        User user = userRepository.findByUsername(username)
                .orElseThrow(
                        () -> new BusinessException(ErrorCode.USER_NOT_FOUND)
                );

        log.info("사용자 ID - {}", user.getId());

        // 여행을 조회 (사용자 소유의 여행인지 재확인)
        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));

        // 여행일지 엔터티 생성
        TravelLog travelLog = TravelLog.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .logDate(request.getLogDate())
                .location(request.getLocation())
                .mood(request.getMood())
                .rating(request.getRating())
                .expenses(request.getExpenses())
                .trip(trip)
                .build();

        // 여행 일지 저장 -> 여행 일지의 ID가 생성됨
        TravelLog savedTravelLog = travelLogRepository.save(travelLog);

        // 해시태그가 있다면 해시태그도 중간테이블에 연계저장
        List<Long> tagIds = request.getTagIds();
        if (tagIds != null && !tagIds.isEmpty()) {
            tagIds.forEach(tagId -> {
                savedTravelLog.addTag(tagRepository.findById(tagId).orElseThrow());
            });
        }

        // 이미지가 있다면 이미지도 함께 INSERT
        if (imageFiles != null && !imageFiles.isEmpty()) {

            // 첨부이미지 파일은 최대 5개만 허용
            for (int i = 0; i < Math.min(imageFiles.size(), 5); i++) {
                try {
                    log.debug("{}번째 파일 업로드 수행중...", i + 1);
                    // 1. 실제 파일이 저장되는 로직
                    MultipartFile file = imageFiles.get(i);
                    // 텅빈 파일이거나 없는 파일은 스킵
                    if (file == null || file.isEmpty()) continue;
                    log.debug("{}번째 파일이 존재함...", i + 1);
                    // 이미지 파일이 아닌것은 스킵
                    if (file.getContentType() == null || !file.getContentType().startsWith("image/")) continue;

                    log.debug("{}번째 파일 검증 통과...", i + 1);

                    // 실제 저장 : 저장되는 컴퓨터의 로컬 경로
                    // C:/Users/user/travels/uploads/kuromi
                    Path userBasePath = Paths.get(fileUploadConfig.getLocation(), username);
                    // 폴더 생성 명령
                    Files.createDirectories(userBasePath);
                    // 원본 파일명 추출
                    String originalFilename = file.getOriginalFilename();

                    // 확장자 추출
                    String ext = originalFilename.substring(originalFilename.lastIndexOf("."));

                    // 파일명 해시암호화 (중복방지)
                    String storedFileName = UUID.randomUUID() + ext;

                    // 실제 저장 명령
                    // C:/Users/user/travels/uploads/kuromi/djksafdjlsafjl-djflsdj.jpg
                    Path target = userBasePath.resolve(storedFileName);
                    Files.copy(file.getInputStream(), target);

                    log.debug("{}번째 파일 서버 업로드완료...", i + 1);

                    // 2. 메타데이터를 디비에 저장하는 로직
                    TravelPhoto photo = TravelPhoto.builder()
                            .displayOrder(i + 1)
                            .originalFilename(originalFilename)
                            .storedFilename(storedFileName)
                            .filePath("/uploads/" + username + "/" + storedFileName)
                            .travelLog(savedTravelLog)
                            .build();

                    travelPhotoRepository.save(photo);
                    log.debug("{}번째 데이터베이스 저장 완료...", i + 1);

                } catch (Exception e) {
                    throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
                }

            }

        }
    }
}