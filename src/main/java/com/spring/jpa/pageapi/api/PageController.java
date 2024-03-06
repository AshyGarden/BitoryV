package com.spring.jpa.pageapi.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Controller
public class PageController {

    @GetMapping("/index") //FrontPage(Page 0)
    public String index(){
        return "index";
    }

    @GetMapping("/login")
    public String login() {

        return "/member/login";
    }

    @GetMapping("/predict")
    public String predict(){

        return "predict/predict";
    }

    @GetMapping("/trend")
    public String trend(){

        return "predict/trend";
    }


    @GetMapping("/history")
    public String history(){

        return "record/history";
    }

    @GetMapping("/market")
    public String market(){

        return "market/market";
    }

    @GetMapping("/trade")
    public String trade(HttpSession session, Model model) {
        // 세션에서 userBudget을 가져옵니다.
        Double userBudget = (Double) session.getAttribute("userBudget");
        if (userBudget == null) {
            userBudget = 0.0; // 예산 정보가 없는 경우 기본값으로 0.0을 사용합니다.
        }

        // 모델에 userBudget을 추가합니다. 뷰에서는 이 값을 사용하여 사용자의 예산을 표시할 수 있습니다.
        model.addAttribute("userBudget", userBudget);

        return "market/trade";
    }


    @GetMapping("/virtualInvest")
    public String virtualInvest(){

        return "record/virtualInvest";
    }



    // 로그인시, userId, budget값을 가져와서 헤더에 저장
    @GetMapping("/loginProcess")
    public String loginProcess(@RequestParam("oti") String oti, @RequestParam("otb") String otb, HttpServletRequest request) {
        // 사용자 정보를 세션에 저장
        HttpSession session = request.getSession();
        session.setAttribute("oti", oti);
        session.setAttribute("otb", otb);

        // 로그인 성공 후 리다이렉트할 페이지
        return "redirect:/trend";
    }


    // 매수버튼 클릭 시, userbudget 차감과 log에 기록이 남도록 하는 함수
    @PostMapping("/api/buy")
    public ResponseEntity<?> buyCoin(@RequestBody BuyOrderDto buyOrderDto, HttpSession session) {
        // 세션에서 현재 사용자의 예산 정보 가져오기
        Double currentUserBudget = (Double) session.getAttribute("userBudget");
        if (currentUserBudget == null) {
            currentUserBudget = 0.0; // 예산 정보가 없는 경우, 기본값을 0으로 설정
        }

        // 매수 주문의 총 금액 계산 (주문 가격 * 주문 수량)
        Double totalOrderAmount = buyOrderDto.getOrderPrice() * buyOrderDto.getOrderQuantity();

        // 수수료 계산 (여기서는 수수료율을 0.25%로 가정)
        Double commission = totalOrderAmount * 0.0025;

        // 총 비용 (수수료 포함)
        Double totalCost = totalOrderAmount + commission;

        // 사용자 예산에서 총 비용 차감
        Double updatedUserBudget = currentUserBudget - totalCost;

        // 거래 기록 생성 (여기서는 간단한 문자열로 표현)
        String transactionRecord = String.format("매수: %s, 수량: %f, 총 비용: %f",
                buyOrderDto.getCoinCode(), buyOrderDto.getOrderQuantity(), totalCost);

        // 업데이트된 예산 정보를 세션에 저장
        session.setAttribute("userBudget", updatedUserBudget);

        // 응답 데이터 생성 및 반환
        Map<String, Object> response = new HashMap<>();
        response.put("userBudget", updatedUserBudget); // 업데이트된 사용자 예산
        response.put("transactionRecord", transactionRecord); // 거래 기록

        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/sell")
    public ResponseEntity<?> sellCoin(@RequestBody SellOrderDto sellOrderDto, HttpSession session) {
        // 세션에서 현재 사용자의 예산 정보 가져오기
        Double currentUserBudget = (Double) session.getAttribute("userBudget");
        if (currentUserBudget == null) {
            currentUserBudget = 0.0; // 예산 정보가 없는 경우, 기본값을 0으로 설정
        }

        // 매도 주문의 총 금액 계산 (주문 가격 * 주문 수량)
        Double totalOrderAmount = sellOrderDto.getSellOrderPrice() * sellOrderDto.getSellOrderQuantity();

        // 수수료 계산 (여기서는 수수료율을 0.25%로 가정)
        Double commission = totalOrderAmount * 0.0025;

        // 총 수입 (수수료 차감)
        Double totalIncome = totalOrderAmount - commission;

        // 사용자 예산에 총 수입 추가
        Double updatedUserBudget = currentUserBudget + totalIncome;

        // 거래 기록 생성 (여기서는 간단한 문자열로 표현)
        String transactionRecord = String.format("매도: %s, 수량: %f, 총 수입: %f",
                sellOrderDto.getCoinCode(), sellOrderDto.getSellOrderQuantity(), totalIncome);

        // 업데이트된 예산 정보를 세션에 저장
        session.setAttribute("userBudget", updatedUserBudget);

        // 응답 데이터 생성 및 반환
        Map<String, Object> response = new HashMap<>();
        response.put("userBudget", updatedUserBudget); // 업데이트된 사용자 예산
        response.put("transactionRecord", transactionRecord); // 거래 기록

        return ResponseEntity.ok(response);
    }

    // 자바 코드 수정
    
    @CrossOrigin(origins = "http://localhost:8181")
    @PostMapping("/send-logs")
    public ResponseEntity<String> sendLogsToPython(@RequestBody String logs) {
        // 파이썬 서버 URL
        String pythonServerUrl = "http://127.0.0.1:5000/process-logs";

        // 파이썬 서버로 요청을 보냅니다.
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(logs, headers); // JSON 데이터로 요청 객체 생성
        ResponseEntity<String> response = restTemplate.postForEntity(pythonServerUrl, request, String.class);
        System.out.print(request);
        System.out.print(response);
        // 파이썬 서버에서 받은 응답을 클라이언트로 반환합니다.
        return ResponseEntity.ok(response.getBody());
    }
}

