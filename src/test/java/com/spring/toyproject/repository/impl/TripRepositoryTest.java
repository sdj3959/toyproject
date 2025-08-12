package com.spring.toyproject.repository.impl;

import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.TripStatus;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.repository.base.TripRepository;
import com.spring.toyproject.repository.base.UserRepository;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import com.spring.toyproject.repository.custom.TripSearchCondition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
class TripRepositoryTest {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private Trip testTrip1;
    private Trip testTrip2;
    private Trip testTrip3;

    @BeforeEach
    void setUp() {
        // 테스트 사용자 생성
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();
        testUser = userRepository.save(testUser);

        // 테스트 여행 데이터 생성
        testTrip1 = Trip.builder()
                .user(testUser)
                .title("제주도 여행")
                .description("제주도 3박 4일 여행")
                .startDate(LocalDate.of(2025, 6, 1))
                .endDate(LocalDate.of(2025, 6, 4))
                .status(TripStatus.COMPLETED)
                .destination("제주도")
                .budget(500000L)
                .build();

        testTrip2 = Trip.builder()
                .user(testUser)
                .title("부산 여행")
                .description("부산 2박 3일 여행")
                .startDate(LocalDate.of(2025, 8, 15))
                .endDate(LocalDate.of(2025, 8, 17))
                .status(TripStatus.ONGOING)
                .destination("부산")
                .budget(300000L)
                .build();

        testTrip3 = Trip.builder()
                .user(testUser)
                .title("강릉 여행")
                .description("강릉 1박 2일 여행")
                .startDate(LocalDate.of(2025, 9, 1))
                .endDate(LocalDate.of(2025, 9, 2))
                .status(TripStatus.PLANNING)
                .destination("강릉")
                .budget(200000L)
                .build();

        tripRepository.save(testTrip1);
        tripRepository.save(testTrip2);
        tripRepository.save(testTrip3);
    }


    @Test
    @DisplayName("사용자별 여행 조회 테스트")
    void findByUser() {
        //given
        // 페이지 정보 생성
        // 페이지 번호는 0출발
        Pageable pageable = PageRequest.of(0, 2);

        // 검색 조건
        TripRepositoryCustom.TripSearchCondition condition
                = TripRepositoryCustom.TripSearchCondition.builder()
                .sortBy("endDate")
                .sortDirection("DESC")
                .build();

        //when
        Page<Trip> tripPage = tripRepository.getTripList(testUser, condition, pageable);
        // 실제 데이터 꺼내기
        List<Trip> tripList = tripPage.getContent();
        //then
        tripList.forEach(System.out::println);

        // 지금 조회된 여행의 개수는 2개일 것으로 단언
        assertThat(tripList).hasSize(2);

        // 총 여행 수는 3개일 것으로 단언
        assertThat(tripPage.getTotalElements()).isEqualTo(3);

        // 총 페이지 수는 2페이지까지 있을 것이다.
        assertThat(tripPage.getTotalPages()).isEqualTo(2);
    }


}