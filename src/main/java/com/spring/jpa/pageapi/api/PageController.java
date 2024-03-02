package com.spring.jpa.pageapi.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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

        return "/predict/predict";
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
    public String Trade(){

        return "market/trade";
    }

    @GetMapping("/virtualInvest")
    public String virtualInvest(){

        return "record/virtualInvest";
    }

}
