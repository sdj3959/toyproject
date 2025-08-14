package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.TravelLog;
import com.spring.toyproject.domain.entity.TravelPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelPhotoRepository extends JpaRepository<TravelPhoto, Long> {

    // 여행일지에 첨부된 모든 이미지 목록 가져오기
    List<TravelPhoto> findByTravelLogOrderByDisplayOrderAsc(TravelLog travelLog);

    // 여행일지에 첨부된 메인 썸네일 가져오기
    TravelPhoto findFirstByTravelLogOrderByDisplayOrderAsc(TravelLog travelLog);

}