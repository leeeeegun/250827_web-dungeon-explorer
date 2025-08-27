package com.example.webdungeonexplorer.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Monster {
    private int x;
    private int y;
    private int hp;
    private int attackPower;
}
