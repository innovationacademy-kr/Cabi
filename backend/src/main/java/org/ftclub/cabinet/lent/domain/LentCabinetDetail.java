package org.ftclub.cabinet.lent.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LentCabinetDetail {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lentCabinetDetailId;

    @Column(length = 64)
    private String title;
    @Column(length = 64)
    private String memo;
    @OneToMany(mappedBy = "lentCabinetDetail", fetch = FetchType.LAZY)
    private List<LentHistory> lentHistoryList = new ArrayList<>();

    public LentCabinetDetail(String title, String memo) {
        this.title = title;
        this.memo = memo;
    }
}
