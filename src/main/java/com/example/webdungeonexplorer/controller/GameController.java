package com.example.webdungeonexplorer.controller;

import com.example.webdungeonexplorer.dto.GameStateResponse;
import com.example.webdungeonexplorer.dto.request.MoveRequest;
import com.example.webdungeonexplorer.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/game")
public class GameController {

    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // 게임 시작 API
    @PostMapping("/start")
    public GameStateResponse getGameState() {
        return gameService.getGameState();
    }

    @PostMapping("/move")
    public GameStateResponse movePlayer(@RequestBody MoveRequest moveRequest) {
        return gameService.movePlayer(moveRequest.getDirection());
    }

    // 공격 API
    @PostMapping("/attack")
    public GameStateResponse attack() {
        return gameService.attack();
    }

    // 아이템 줍기 API
    @PostMapping("/pickup")
    public GameStateResponse pickupItem() {
        return gameService.pickupItem();
    }

}
