import http from 'k6/http';
import {check, sleep} from 'k6';

export const options = {
  scenarios: {
    x_lock: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      exec: 'xLockTest',
      tags: {test_type: 'x_lock'},
    },
    distributed_lock: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      exec: 'distributedLockTest',
      startTime: '31s',
      tags: {test_type: 'distributed_lock'},
    },
  },
  // 다양한 백분위수 보기
  summaryTrendStats: ['min', 'avg', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// X Lock 테스트 함수
export function xLockTest() {
  const baseUrl = 'http://localhost';
  const userId = __VU + 100;
  const cabinetId = 17;

  const url = `${baseUrl}/v4/lent/cabinets/${cabinetId}/${userId}`;
  const headers = {'Content-Type': 'application/json'};

  // 중요: 모든 요청에 lock_type 태그 추가
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

  sleep(1);
}

// Distributed Lock 테스트 함수
export function distributedLockTest() {
  const baseUrl = 'http://localhost';
  const userId = __VU + 200;
  const cabinetId = 18;

  const url = `${baseUrl}/v4/lent/cabinets/${cabinetId}/${userId}/2`;
  const headers = {'Content-Type': 'application/json'};

  // 중요: 모든 요청에 lock_type 태그 추가
  const response = http.post(url, null, {
    headers: headers,
    tags: {
      lock_type: 'distributed_lock',
      cabinet_id: cabinetId.toString()
    }
  });

  check(response, {
    'distributed_lock - success': (r) => r.status === 200,
    'distributed_lock - conflict': (r) => r.status === 409 || r.status === 423,
    'distributed_lock - bad request': (r) => r.status === 400
  });

  sleep(1);
}