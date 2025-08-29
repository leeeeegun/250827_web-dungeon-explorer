package com.example.webdungeonexplorer.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Player {
    private int x;
    private int y;
    private int hp;
    private int maxHp;
    private int attackPower;
    private List<Item> inventory = new ArrayList<>();

    public Player(int x, int y, int hp, int attackPower) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.maxHp = hp; // maxHp를 초기 hp와 동일하게 설정
        this.attackPower = attackPower;
    }
}