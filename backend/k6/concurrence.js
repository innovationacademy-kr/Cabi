import http from 'k6/http';
import {check} from 'k6';

export const options = {
  scenarios: {
    both_locks: {
      executor: 'constant-vus',
      vus: 100,  // 전체 VU 수를 늘려서 두 락 타입을 동시에 테스트
      duration: '30s',
      exec: 'bothLocksTest',
      tags: {test_type: 'both_locks'},
    },
  },
  summaryTrendStats: ['min', 'avg', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// 두 락을 동시에 테스트하는 함수
export function bothLocksTest() {
  // 각 VU가 X Lock 또는 분산락 중 하나를 선택하도록 구성
  if (__VU % 2 === 0) {  // 짝수 VU는 X Lock 테스트
    const baseUrl = 'http://localhost';
    const userId = __VU + 100;
    const cabinetId = 17;

    const url = `${baseUrl}/v4/lent/cabinets/${cabinetId}/${userId}`;
    const headers = {'Content-Type': 'application/json'};

    const response = http.post(url, null, {
      headers: headers,
      tags: {
        lock_type: 'x_lock',
        cabinet_id: cabinetId.toString()
      }
    });

    check(response, {
      'x_lock - success': (r) => r.status === 200,
      'x_lock - conflict': (r) => r.status === 409 || r.status === 423,
      'x_lock - bad request': (r) => r.status === 400
    });

  } else {  // 홀수 VU는 분산락 테스트
    const baseUrl = 'http://localhost';
    const userId = __VU + 200;
    const cabinetId = 18;

    const url = `${baseUrl}/v4/lent/cabinets/${cabinetId}/${userId}/2`;
    const headers = {'Content-Type': 'application/json'};

    const response = http.post(url, null, {
      headers: headers,
      tags: {
        lock_type: 'distributed_lock',
        cabinet_id: cabinetId.toString()
      }
    });

    check(response, {
      'distributed_lock - success': (r) => r.status === 200,
      'distributed_lock - cabinet full': (r) => r.status === 409,
      'distributed_lock - conflict': (r) => r.status === 423,
      'distributed_lock - bad request': (r) => r.status === 400
    });

  }
}