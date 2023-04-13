package org.ftclub.cabinet.lent.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "LENT_CABINET_DETAIL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LentCabinetDetail {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LENT_CABINET_DETAIL_ID")
    private Long lentCabinetDetailId;

    @Column(name = "TITLE", length = 64)
    private String title;

    @Column(name = "MEMO", length = 64)
    private String memo;

    @OneToMany(mappedBy = "lentCabinetDetail", fetch = FetchType.LAZY)
    private List<LentHistory> lentHistoryList = new ArrayList<>();

    public LentCabinetDetail(String title, String memo) {
        this.title = title;
        this.memo = memo;
    }
}
