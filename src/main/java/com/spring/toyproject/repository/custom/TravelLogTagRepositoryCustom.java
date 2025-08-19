package com.spring.toyproject.repository.custom;

import com.spring.toyproject.domain.entity.Tag;

import java.util.List;

public interface TravelLogTagRepositoryCustom {

    // 여행일지 ID로 해시태그 목록 조회
    List<Tag> findTagsByTravelLogId(Long travelLogId);
}
