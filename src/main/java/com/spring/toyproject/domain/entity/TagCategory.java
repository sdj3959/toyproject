package com.spring.toyproject.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 태그 카테고리 ENUM
 * 여행일지 태그를 분류하기 위한 카테고리 정의
 */
@Getter
@AllArgsConstructor
public enum TagCategory {
    LOCATION("장소"),
    ACTIVITY("활동"),
    FOOD("음식"),
    TRANSPORT("교통"),
    ACCOMMODATION("숙박"),
    WEATHER("날씨"),
    MOOD("기분"),
    PEOPLE("사람"),
    CULTURE("문화"),
    NATURE("자연"),
    CITY("도시"),
    COUNTRYSIDE("시골"),
    MOUNTAIN("산"),
    BEACH("해변"),
    MUSEUM("박물관"),
    SHOPPING("쇼핑"),
    NIGHTLIFE("야간생활"),
    OTHER("기타");

    private final String description;

}