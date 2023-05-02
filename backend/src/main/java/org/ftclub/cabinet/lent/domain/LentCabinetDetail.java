package org.ftclub.cabinet.lent.domain;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "LENT_CABINET_DETAIL")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class LentCabinetDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
