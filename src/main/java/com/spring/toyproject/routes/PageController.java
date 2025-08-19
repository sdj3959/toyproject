package com.spring.toyproject.routes;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 페이지 전환 렌더링용 컨트롤러
 * Thymeleaf나 JSP같은 뷰템플릿 페이지를 렌더링
 */
@Controller
@Slf4j
public class PageController {

    // 홈으로 이동
    @GetMapping("/")
    public String home() {
        return "index";
    }
    // 로그인페이지으로 이동
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    // 회원가입 페이지로 이동
    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }

    // 대시보드 페이지로 이동
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    // 여행목록 페이지로 이동
    @GetMapping("/trips")
    public String trips() {
        return "trip-list";
    }

    // 여행 등록 페이지
    @GetMapping("/trips/new")
    public String tripForm() {
        return "trip-form";
    }

    // 여행 상세보기 페이지
    @GetMapping("/trips/detail")
    public String tripsDetail() {
        return "trip-detail";
    }

    // 여행 일지등록 페이지
    @GetMapping("/travel-logs/new")
    public String travelForm() {
        return "travel-log-form";
    }

    // 여행 일지목록 페이지
    @GetMapping("/travel-logs")
    public String travelList() {
        return "travel-log-list";
    }

}
