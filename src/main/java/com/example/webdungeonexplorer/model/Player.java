package com.example.webdungeonexplorer.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {
    private int x;
    private int y;
    private int hp;
}
