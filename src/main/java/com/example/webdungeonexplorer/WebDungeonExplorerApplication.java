package com.example.webdungeonexplorer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.example.webdungeonexplorer")
public class WebDungeonExplorerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebDungeonExplorerApplication.class, args);
    }

}