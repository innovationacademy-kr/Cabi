export const options = {
  scenarios: {
    x_lock_scenarios: {
      executor: 'constant-vus',
      vus: 50,
      duration: '30s',
      exec: 'xLockTest',
      tags: {test_type: 'x_lock'},
    },
  },
  summaryTrendStats: ['min', 'avg', 'med', 'max', 'p(90)', 'p(95)', 'p(99)']
}