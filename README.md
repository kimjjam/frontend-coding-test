# PandaCSS 보상 슬롯

아침·점심·저녁 시간대별 보상과 추가 기회, 4번째 보너스 슬롯을 구현한
React + TypeScript + PandaCSS 프로젝트입니다.

## GitHub Repository

https://github.com/kimjjam/frontend-coding-test

## 실행

```bash
pnpm install
pnpm dev
```

프로덕션 빌드와 테스트:

```bash
pnpm test
pnpm build
```

## 테스트 URL

- `/?test=morning`
- `/?test=lunch`
- `/?test=dinner`

`test`가 없으면 기기의 현재 시간을 사용합니다. 진행 상태는 날짜별 `localStorage`에
저장되며 화면 아래의 **오늘 기록 초기화**로 삭제할 수 있습니다.

## 구현 규칙

- 기본 슬롯은 현재 시간대에만 활성화됩니다.
- 이후 슬롯을 완료한 상태에서 이전 슬롯을 놓쳤다면, 가장 최근에 놓친 슬롯 하나가
  추가 기회로 열립니다. 추가 기회는 하루 1회만 사용할 수 있습니다.
- 외부 페이지에서 3초 이상 체류하고 돌아온 경우에만 보상이 지급됩니다.
- 기본 슬롯 3개의 보상을 모두 받으면 4번째 보너스 슬롯이 표시됩니다.
- 재사용 가능한 `Button`은 `variant`, `size`, `disabled`, `loading` 상태를 지원합니다.
- `Popup`은 ESC, 배경 클릭, 닫기 버튼으로 닫을 수 있는 접근성 다이얼로그입니다.
