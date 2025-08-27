package com.example.webdungeonexplorer.controller;

import com.example.webdungeonexplorer.dto.GameStateResponse;
import com.example.webdungeonexplorer.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/gome")
public class GameController {

    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // 현재 게임 상태를 조회하는 API
    @GetMapping("/state")
    public GameStateResponse getGameState() {
        return gameService.getGameState();
    }

}
