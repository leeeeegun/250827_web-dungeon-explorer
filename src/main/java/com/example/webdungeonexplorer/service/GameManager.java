package com.example.webdungeonexplorer.service;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameManager {
    private final Map<String, GameService> games = new ConcurrentHashMap<>();

    public GameService getGame(String sessionId) {
        return games.computeIfAbsent(sessionId, id -> new GameService());
    }

    public void removeGame(String sessionId) {
        games.remove(sessionId);
    }
}
