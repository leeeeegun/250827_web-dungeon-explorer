package com.example.webdungeonexplorer.demotest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public String sayHello() {
        // "/api/hello" 라는 주소로 요청이 오면 이 글자를 반환해!
        return "Hello from Spring Boot!";
    }
}