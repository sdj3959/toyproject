package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.Tag;
import com.spring.toyproject.domain.entity.TagCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * 태그명으로 태그 조회
     */
    Optional<Tag> findByName(String name);

    /**
     * 태그 중복 확인
     */
    boolean existsByName(String name);

    /**
     * 카테고리별 태그 목록 조회
     */
    List<Tag> findByCategoryOrderByName(TagCategory category);
}