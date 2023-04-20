package org.ftclub.cabinet.dto;

import lombok.*
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {
    private Long userId;
    private String name; // 기존 intra_id
    private Optional<String> email; // optional을 써야할지? 아니면 Null 값을 넣을지
}
