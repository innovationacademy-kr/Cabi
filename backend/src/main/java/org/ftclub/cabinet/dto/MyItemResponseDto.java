package org.ftclub.cabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
@AllArgsConstructor
public class MyItemResponseDto {
    List<ItemDto> extensionItems;
    List<ItemDto> swapItems;
    List<ItemDto> alarmItems;
}
