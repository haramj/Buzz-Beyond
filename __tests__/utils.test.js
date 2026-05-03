/**
 * Weather App 단위 테스트 케이스
 * 1. 데이터 포맷팅 안정성
 * 2. 엣지 케이스 처리 (Null, undefined, 극단적 수치)
 * 3. 비즈니스 로직 검증
 */

// 테스트 대상 함수들 (실제 utils 파일이 있다면 import 하세요)
const formatTemp = (temp) => (temp !== null && temp !== undefined ? temp.toFixed(2) : "0.00");
const getWindDirection = (deg) => {
  if (deg === null || deg === undefined || deg < 0 || deg > 360) return 'Unknown';

  if (deg >= 337.5 || deg < 22.5) return 'N';
  if (deg >= 22.5 && deg < 67.5) return 'NE';
  if (deg >= 67.5 && deg < 112.5) return 'E';
  if (deg >= 112.5 && deg < 157.5) return 'SE';
  if (deg >= 157.5 && deg < 202.5) return 'S';
  if (deg >= 202.5 && deg < 247.5) return 'SW';
  if (deg >= 247.5 && deg < 292.5) return 'W';
  if (deg >= 292.5 && deg < 337.5) return 'NW';
  
  return 'Unknown';
};

describe('Weather App 정밀 단위 테스트', () => {
  
  describe('1. 기온 데이터 포맷팅 (formatTemp)', () => {
    test('일반적인 양수 기온을 소수점 둘째 자리까지 반올림한다', () => {
      expect(formatTemp(14.6258)).toBe('14.63');
    });

    test('영하의 기온을 정확히 처리한다', () => {
      expect(formatTemp(-5.5)).toBe('-5.50');
    });

    test('데이터가 null이나 undefined일 경우 0.00을 반환하여 크래시를 방지한다 (SRE Edge Case)', () => {
      expect(formatTemp(null)).toBe('0.00');
      expect(formatTemp(undefined)).toBe('0.00');
    });
  });

  describe('2. 풍향 데이터 변환 (getWindDirection)', () => {
    test('0도(북풍)를 정확히 반환한다', () => {
      expect(getWindDirection(0)).toBe('N');
    });

    test('180도(남풍)를 정확히 반환한다', () => {
      expect(getWindDirection(180)).toBe('S');
    });

    test('범위를 벗어난 값이 들어올 경우 Unknown을 반환한다', () => {
      expect(getWindDirection(-1)).toBe('Unknown');
      expect(getWindDirection(400)).toBe('Unknown');
    });
  });

  describe('3. 시간 및 날짜 처리', () => {
    test('날짜 객체가 시안과 일치하는 "May 3" 포맷으로 변환되는지 확인', () => {
      const date = new Date('2026-05-03T00:00:00');
      const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      expect(formatted).toBe('May 3');
    });

    test('오후 시간이 PM으로 정상 표시되는지 확인', () => {
      const date = new Date('2026-05-03T14:30:00');
      const formatted = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      // 환경에 따라 02:30 PM 혹은 2:30 PM일 수 있으므로 포함 여부 확인
      expect(formatted).toMatch(/PM/);
    });
  });

  describe('4. 데이터 무결성 검증 (SRE Perspective)', () => {
    test('인구수 데이터에 콤마가 정상적으로 삽입되는지 확인', () => {
      const population = 10349312;
      const formatted = population.toLocaleString();
      expect(formatted).toBe('10,349,312');
    });
  });
});