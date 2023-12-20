package org.ftclub.cabinet.lent.newService;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.repository.LentRedis;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LentCommandService {

    private final LentRepository lentRepository;
    private final LentRedis lentRedis;
}
