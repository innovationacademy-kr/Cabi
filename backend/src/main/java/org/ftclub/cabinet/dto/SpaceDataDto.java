package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SpaceDataDto {
    private String building;
    private Integer[] floors;
}