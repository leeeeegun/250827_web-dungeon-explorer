package com.example.webdungeonexplorer.controller;

import com.example.webdungeonexplorer.dto.GameStateResponse;
import com.example.webdungeonexplorer.dto.request.MoveRequest;
import com.example.webdungeonexplorer.service.GameManager;
import com.example.webdungeonexplorer.service.GameService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/game")
public class GameController {

    private final GameManager gameManager;

    @Autowired
    public GameController(GameManager gameManager) {
        this.gameManager = gameManager;
    }

    private GameService getGameService(HttpSession session) {
        return gameManager.getGame(session.getId());
    }

    @GetMapping("/state")
    public GameStateResponse getGameState(HttpSession session) {
        return getGameService(session).getGameState();
    }

    @PostMapping("/move")
    public GameStateResponse movePlayer(@RequestBody MoveRequest moveRequest, HttpSession session) {
        return getGameService(session).movePlayer(moveRequest.getDirection());
    }

    @PostMapping("/attack")
    public GameStateResponse attack(HttpSession session) {
        return getGameService(session).attack();
    }

    @PostMapping("/pickup")
    public GameStateResponse pickupItem(HttpSession session) {
        return getGameService(session).pickupItem();
    }

    @PostMapping("/restart")
    public GameStateResponse restartGame(HttpSession session) {
        return getGameService(session).restartGame();
    }
}