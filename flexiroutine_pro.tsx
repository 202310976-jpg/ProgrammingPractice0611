import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. 핵심 생체역학 및 안전 스트레칭 데이터 정의
// ==========================================
const STRETCH_RESOURCES = {
  before: {
    title: "동적 스트레칭 (Dynamic Warm-up)",
    concept: "운동 전 관절 가동성 확보",
    mechanism: "심박수를 점진적으로 올리고 관절 내 윤활액 분비를 자극하여 본 운동 전 가동 범위(ROM)를 일시적으로 극대화합니다.",
    warning: "⚠️ 경고: 운동 직전에 근육을 늘린 채 가만히 멈춰 서 있는 '정적 스트레칭'을 가하면, 근원섬유의 탄성이 느슨해져 순간 근동원력(Force)이 2.5% 이상 즉각 소실되고 관절의 부상 위험이 가중됩니다.",
    upper: {
      routineName: "상체 회전근개 보호 및 관절 활성화 루틴",
      steps: [
        { name: "암 서클 (Arm Circles)", desc: "양팔을 수평으로 곧게 뻗고 가볍게 원을 그리며 어깨 주변부 온도를 높이고 윤활 작용을 유도합니다. (앞뒤 각각 15회)" },
        { name: "Y-T-W-L 가동성 드릴", desc: "등 뒤 견갑골 주변 근육을 수축 및 이완하여 흉추의 신전 가동각을 능동적으로 확보합니다. (10회 반복)" }
      ],
      videoUrl: "https://www.youtube.com/embed/_hyJjSGJAEo",
      cues: "팁: 목과 어깨가 과도하게 으쓱하지 않도록 귀와 어깨의 간격을 유지하세요."
    },
    lower: {
      routineName: "하체 고관절 기동성 및 대퇴 웜업 루틴",
      steps: [
        { name: "레그 스윙 (Leg Swings)", desc: "기둥을 손으로 지지하고 서서 다리를 앞뒤, 좌우로 흔들며 고관절 굴곡근을 다이내믹하게 깨워줍니다. (양발 각각 12회)" },
        { name: "런지 트위스트 (Lunge with Twist)", desc: "런지 하강 자세에서 디딘 무릎 방향으로 몸통을 회전하여 고관절 및 코어의 협응성을 유도합니다. (왕복 10회)" }
      ],
      videoUrl: "https://www.youtube.com/embed/Jaw7LUmEkBk",
      cues: "팁: 무릎이 안쪽으로 쏠리지 않도록 두 번째 발가락 방향과 무릎의 수직 정렬을 맞추세요."
    }
  },
  after: {
    title: "정적 스트레칭 (Static Cool-down)",
    concept: "운동 후 흥분 가라앉히기 및 근섬유 복원",
    mechanism: "훈련 도중 하중 압박으로 심하게 단축되고 긴장된 타겟 근섬유를 호흡과 함께 차분히 이완하여 원래 길이로 늘여 복구합니다.",
    warning: "⚠️ 경고: 반동을 주는 탄성 스트레칭은 오히려 타겟 부위의 인대와 건에 과하중 손상을 입히므로 절대 삼가고, 호흡을 깊이 내쉬며 최소 15초 이상 정지 상태를 유지하세요.",
    upper: {
      routineName: "단축된 상반신 대흉근 및 승모근 릴리즈 이완",
      steps: [
        { name: "차일드 포즈 (Child's Pose)", desc: "바닥에 꿇어앉아 이마를 내리고 팔을 앞으로 뻗어 등 광배근 및 흉추 라인을 가볍게 늘려 안정시킵니다. (25초 정지)" },
        { name: "오버헤드 트라이셉스 스트레칭", desc: "머리 뒤로 팔꿈치를 접어 넘긴 뒤 반대 손으로 가볍게 당겨 삼두근과 외측 갈비뼈 주변을 시원하게 늘려줍니다. (좌우 각각 20초)" }
      ],
      videoUrl: "https://www.youtube.com/embed/OcDhmXXgi8Q",
      cues: "팁: 호흡을 의도적으로 참지 말고 천천히 내쉬며 몸의 긴장도를 점진적으로 풉니다."
    },
    lower: {
      routineName: "과긴장 하체 후면 햄스트링 및 골반 정렬 이완",
      steps: [
        { name: "카우치 스트레칭 (Couch Stretch)", desc: "무릎을 바닥에 고정하고 골반을 앞 방향으로 밀어내 굳어있던 앞쪽 고관절 장요근 영역을 길게 늘려줍니다. (좌우 각각 30초)" },
        { name: "햄스트링 누운 정적 홀드", desc: "바닥에 일자로 누워 다리를 하늘로 뻗어준 뒤, 밴드나 손을 활용해 몸쪽으로 천천히 끌어당깁니다. (좌우 각각 25초)" }
      ],
      videoUrl: "https://www.youtube.com/embed/UIRTPXj1Q1U",
      cues: "팁: 엉덩이가 바닥에서 둥글게 말려 뜨지 않도록 꼬리뼈를 바닥에 가볍게 눌러 밀착시키세요."
    }
  }
};

const JOINT_EFFECTS_DATA = {
  ankle: {
    name: "발목 관절 (Ankle Joint)",
    rom: "배측굴곡 (Dorsiflexion) 정상각: 20° ~ 25°",
    effect: "운동 전 동적 가이드를 통해 가동 범위를 일시 확보하면 스쿼트 시 상체 숙여짐을 억제합니다.",
    risk: "방치 시 뒤꿈치가 뜨며 요추 하중이 150% 가중되어 급성 허리 염좌 및 디스크 파열을 유발함.",
    details: {
      testName: "5-인치 벽 터치 자가 테스트 (Knee-to-Wall Test)",
      testGuide: "벽에서 10cm가량 뒤꿈치를 떼고 똑바로 서서 무릎을 천천히 구부려 앞 벽면에 무릎이 닿는지 확인합니다. 이때 바닥에서 뒤꿈치가 조기 이탈하면 발목의 가동성(Dorsiflexion) 제한 상태로 판단합니다.",
      clinicalNote: "발목 관절 가동 각도가 15도 미만으로 강직되어 있으면, 스쿼트 바닥 지점에서 균형을 잃고 상체를 무의식적으로 앞으로 과하게 수숙여 보상하게 됩니다. 이는 모멘트 암을 극대화시켜 요추에 살인적인 회전 스트레스를 직접 부과합니다.",
      rehabTips: "발목 롤링 마사지와 더불어 정강이 앞쪽 전경골근을 수축시키는 저항 밴드 훈련을 15회 3세트씩 동반해 주는 것이 가동각 활성화에 매우 효율적입니다."
    }
  },
  hip: {
    name: "고관절 (Hip Joint)",
    rom: "굴곡 (Flexion) 정상각: 110° ~ 125°",
    effect: "장요근과 둔근 주위를 활성화하여 골반의 대칭적 하강 동작 제어 능력을 복원합니다.",
    risk: "방치 시 스쿼트 바닥 구간에서 꼬리뼈가 말려 들어가는 '벗윙크'가 발생해 척추 인대가 파열됨.",
    details: {
      testName: "누워서 무릎 가슴 닿기 테스트 (Thomas Test)",
      testGuide: "침대 가장자리에 걸터누워 한쪽 무릎을 양손으로 가슴 방향으로 깊게 끌어당깁니다. 이때 반대쪽 다리의 허벅지가 바닥에서 들리거나 가랭이가 외측으로 회전한다면 앞쪽 고관절 굴곡근(장요근)의 단축을 의심해야 합니다.",
      clinicalNote: "고관절 굴곡 유연성이 제한되면, 스쿼트 하강 과정 중 골반이 강제로 하향 회전하면서 꼬리뼈가 아래로 미끄러지는 '벗윙크(Butt Wink)'를 만듭니다. 이로 인해 요추가 구부러지면서 순간 전단 하중이 척추 추간판(디스크) 안쪽으로 무방비하게 가중됩니다.",
      rehabTips: "허리가 과도하게 꺾이지 않는 중립 범위 내에서 골반 앞부분을 평평하게 밀어내 주는 정적 런지 자세 홀딩(30초 3회 반복)을 통해 장요근 길이를 원상 복구시키는 것이 안전합니다."
    }
  },
  shoulder: {
    name: "어깨 관절 (Shoulder Joint)",
    rom: "외전 (Abduction) 정상각: 180°",
    effect: "회전근개 내 온도를 높이고 활액 분비를 유도하여 견봉하 공간의 유연한 마찰을 보장합니다.",
    risk: "방치 시 프레스 및 풀업 동작 시 회전근개 힘줄이 지붕 뼈와 충돌하여 염증성 건염을 유발함.",
    details: {
      testName: "Apley 등 긁기 자가 테스트 (Scratch Test)",
      testGuide: "한쪽 손은 등 위로 넘기고, 다른 손은 등 아래로 넣어 양 손가락 끝이 닿거나 거리가 10cm 이내인지 측정합니다. 양쪽 범위 편차가 지나치게 심하다면 견갑골의 비대칭적 유동성과 회전근개의 밸런스 붕괴를 시사합니다.",
      clinicalNote: "견봉하 공간은 유연한 어깨 가동이 없으면 1.2cm 미만으로 급격히 좁아집니다. 이 상태로 밀리터리 프레스나 무거운 데드리프트 등의 견갑 수축 강제 운동을 전개하면 상완골두가 견봉 뼈 돌기를 지속적으로 갉아먹으며 만성적 염증(충돌증후군)을 발생시킵니다.",
      rehabTips: "탄성 밴드를 가슴 앞에 고정하고 팔꿈치를 몸통에 밀착시킨 뒤 바깥쪽으로 당기는 외회전 훈련(External Rotation, 20회)을 수행하여 어깨 후면 회전근개(극하근, 소원근)의 동원율을 사전에 끌어올려 주어야 합니다."
    }
  }
};

const ACCIDENT_ARCHIVE_DATA = [
  {
    id: 1,
    title: "아킬레스건 미세 부하 파열 및 건염",
    cause: "겨울철 혹은 냉방된 헬스장에서 발목 동적 웜업 없이 곧바로 스쿼트 및 러닝 강행",
    mechanism: "예열되지 않아 단단한 상태의 아킬레스 힘줄이 강한 수축 부하를 견디지 못하고 미세 파열됨.",
    details: {
      recoveryTime: "경증 건염의 경우 약 3~4주, 부분 파열의 경우 수술 비수술 막론하고 12주 이상의 장기 고정 및 물리 치료 요구",
      warningList: [
        "기온이 극도로 추운 야외 및 에어컨 직사광 아래서 훈련 시 아킬레스건 부근에 온열 보호대 상시 착용할 것",
        "달리기나 스쿼트의 세트 도중 발꿈치 바로 윗 부근에서 뚝 소리와 함께 무언가 걷어차인 듯한 압박 타격감이 온다면 지체 없이 병원 응급실로 내원할 것",
        "체중을 이용한 무리한 종아리 탄성 반동 점프 스트레칭은 아킬레스 접합부 파열을 유도하므로 무반동 정적 스트레칭만 제한적으로 도입할 것"
      ],
      rehabSolution: "초기 급성기에는 염증 제거를 위한 냉찜질과 소염 조치를 준수하며, 이후 회복기에는 뒤꿈치를 지면 아래로 천천히 내렸다가 능동적으로 들어 올리는 '카프 레이즈'를 밴드나 보조 난간을 짚고 통증 없는 무통 각도 내에서 천천히 복원 운동으로 처방합니다."
    }
  },
  {
    id: 2,
    title: "요추 4·5번 급성 인대 파열",
    cause: "고관절 장요근 가동성이 완전히 굳어있는 상태로 고중량 백스쿼트 전개",
    mechanism: "고관절 대신 골반과 허리가 대신 구부러지는 보상 작용이 발생하여 수직 하중이 요추에 그대로 집중됨.",
    details: {
      recoveryTime: "급성 요추 인대 염좌 및 미세 섬유륜 찢어짐 발생 시 보존적 처방으로 최소 6주에서 완전 재생까지는 약 6개월 소요",
      warningList: [
        "장시간 좌식 업무를 마친 직후 골반 고관절 부위의 가벼운 동적 스윙 없이 70% 이상의 고중량 바벨 리프팅을 일절 차단할 것",
        "훈련 세트 중 허리에 힘이 풀리거나 바닥권에서 꼬리뼈가 말려들어 허리가 완만해지는(벗윙크) 현상이 발견되면 세트를 즉각 취소할 것",
        "무릎을 곧게 편 채 바닥으로 상체를 급하게 눌러 구부리는 정적 햄스트링 스트레칭은 요추 뒷면 인대를 과도하게 늘려 인대 파열을 악화시키므로 자제할 것"
      ],
      rehabSolution: "골반의 뒤틀림을 방지하는 코어 중립을 고수하기 위해 천장을 보고 누워 무릎을 세운 뒤, 허리가 들리지 않도록 바닥으로 꼬리뼈와 등허리를 강하게 밀어내 누르는 맥길 디렉션 코어 중립 훈련 및 플랭크 동작을 정적 이완 이후 강화 훈련으로 병행 적용합니다."
    }
  }
];

export default function App() {
  // ==========================================
  // 2. React UI 라우팅 및 인터랙션 상태 선언
  // ==========================================
  const [showWelcome, setShowWelcome] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'tutorial' | 'guide-detail'
  
  // 새 창으로 넘겨줄 가이드 파라미터 상태
  const [prefilledTiming, setPrefilledTiming] = useState('before'); // 'before' | 'after'
  const [selectedTarget, setSelectedTarget] = useState(null); // 'upper' | 'lower' | null
  const [selectedJoint, setSelectedJoint] = useState('ankle'); // 'ankle' | 'hip' | 'shoulder'

  // 타이머 전용 상태
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // 모달 제어용 신규 상태 (자세히 보기 전용)
  const [selectedJointDetail, setSelectedJointDetail] = useState(null); // 'ankle' | 'hip' | 'shoulder' | null
  const [selectedAccidentDetail, setSelectedAccidentDetail] = useState(null); // 1 | 2 | null

  // 로컬 저장소 체크 (자동 온보딩 패스)
  useEffect(() => {
    try {
      const isBypassed = localStorage.getItem('bypassWelcomeModal');
      if (isBypassed === 'true') {
        setShowWelcome(false);
      }
    } catch (e) {
      console.warn("LocalStorage access is restricted in this environment.");
    }
  }, []);

  // 실시간 타이머 가동 이펙트
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  // 온보딩 닫기 및 라우팅 처리
  const handleCloseWelcome = (startTutorial = false) => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('bypassWelcomeModal', 'true');
      } catch (e) {
        console.warn("Could not save to LocalStorage.");
      }
    }
    setShowWelcome(false);
    setCurrentView(startTutorial ? 'tutorial' : 'main');
  };

  // 메인창 카드 클릭 시 -> pre-fill 데이터 셋업 및 가이드 상세창 열기
  const openGuideWindow = (timing) => {
    setPrefilledTiming(timing);
    setSelectedTarget(null); // 진입 시 부위는 미선택 상태로 셋업하여 예외 처리 활성화
    resetTimer();
    setCurrentView('guide-detail');
  };

  // 타이머 제어 함수
  const startTimer = () => {
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);
  };

  // 앵커 스크롤 헬퍼
  const scrollToSection = (id) => {
    setCurrentView('main');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const prescription = selectedTarget ? STRETCH_RESOURCES[prefilledTiming][selectedTarget] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* ──────────────────────────────────────────
          [A] 처음 방문자용 웰컴 모달 (Onboarding)
          ────────────────────────────────────────── */}
      {showWelcome && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl text-center transform scale-100 transition-transform duration-300 border border-slate-100">
            <span className="text-6xl mb-4 block animate-bounce">🤸‍♂️</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">시스템 처음 방문이신가요?</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed px-2">
              자신의 관절 유연성 한계를 인지하지 못하고 무작정 리프팅을 진행하면 요추에 150% 이상의 과하중 부상이 유발됩니다. 안전 가이드를 받아보세요!
            </p>

            <div className="flex flex-col gap-2.5 mt-8 w-full">
              <button
                onClick={() => handleCloseWelcome(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                📖 사이트 튜토리얼 (이용 가이드 보기)
              </button>
              <button
                onClick={() => handleCloseWelcome(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 font-bold py-3 rounded-xl text-xs transition-all"
              >
                ⚡ 바로 메인 제어창으로 진입
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-400">
              <input
                type="checkbox"
                id="noShowBox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-slate-300 rounded cursor-pointer accent-emerald-500"
              />
              <label htmlFor="noShowBox" className="cursor-pointer select-none hover:text-slate-600 font-medium">
                다시 띄우지 않기
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 글로벌 통합 네비게이션 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white p-2 rounded-xl text-lg shadow-xs">🤸‍♂️</div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">FlexiRoutine Pro</h1>
            <p className="text-[10px] text-slate-400 font-medium">설계자: 임세빈 (202310976)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentView('main')} 
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${currentView === 'main' ? 'bg-slate-950 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            📱 메인 게이트
          </button>
          <button 
            onClick={() => setCurrentView('tutorial')} 
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${currentView === 'tutorial' ? 'bg-slate-950 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            📖 튜토리얼
          </button>
        </div>
      </header>

      {/* ==========================================
          [B] 뷰 1: 사이트 튜토리얼 화면 (소개 및 퀵 링크)
          ========================================== */}
      {currentView === 'tutorial' && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 animate-fadeIn">
          <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-2xl shadow-xs text-center">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block mb-2">원하는 서비스 모듈로 고속 접속</span>
            <h2 className="text-xl font-black text-slate-900 mb-6">사이트 튜토리얼 및 네비게이션</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-left flex flex-col justify-between shadow-xs">
                <div>
                  <div className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-md w-fit mb-3">🏃‍♂️ 트레이닝 진행 중</div>
                  <h4 className="text-sm font-black text-emerald-900">스트레칭 시뮬레이션</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">현재 수행하려는 운동의 전/후 최적 시점을 선택하여 세밀한 동적/정적 루틴 가이드를 전용 제어창을 통해 처방받습니다.</p>
                </div>
                <button 
                  onClick={() => scrollToSection('top-fold-gate')}
                  className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs transition-all text-center shadow-xs"
                >
                  스트레칭 가이드 시작하기 &rarr;
                </button>
              </div>

              <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl text-left flex flex-col justify-between shadow-xs">
                <div>
                  <div className="bg-sky-100 text-sky-800 text-xs font-black px-2.5 py-1 rounded-md w-fit mb-3">🔬 예방 및 학습 목적</div>
                  <h4 className="text-sm font-black text-sky-900">가동성 및 리스크 아카이브</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">해부학적인 관절 가동 범위(ROM)의 데이터 수치와, 웜업 미준수로 실제 부상 피해를 겪은 리스크 역학 지표를 상세히 파악합니다.</p>
                </div>
                <button 
                  onClick={() => scrollToSection('bottom-fold-archive')}
                  className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-2.5 rounded-xl text-xs transition-all text-center shadow-xs"
                >
                  해부학 & 사고 자료실 보기 &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* 피드백 반영: 전형화된 1, 2, 3 레이아웃 설명 본문 */}
          <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
            <h3 className="font-black text-base text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="text-emerald-500">📖</span> FlexiRoutine 서비스 가이드 핵심 요약
            </h3>
            
            <div className="space-y-4 text-xs leading-relaxed text-slate-600">
              
              {/* 1. 필요성 및 미이행시의 구조적 위험성 (통합 정돈) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="font-black text-slate-950 text-sm mb-2 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs w-5 h-5 rounded-full inline-flex items-center justify-center font-bold">1</span>
                  스트레칭의 생리학적 필요성 및 미이행 시 위험성
                </p>
                <p className="pl-7 text-slate-600 leading-relaxed">
                  훈련 전 동적 워밍업은 관절 가동 범위(ROM)를 능동적으로 선확보하여 인체의 기계적 결함을 막는 핵심 장치입니다. 유연성 부족 상태에서 무리한 리프팅을 진행하게 되면 고관절이나 발목 대신 인접 관절인 허리(요추)가 대신 휘어버리는 <strong>'관절 사슬 보상 작용'</strong>이 강제 발현됩니다. 이로 인해 요추에 평소보다 무려 <strong className="text-rose-600">150% 이상의 격렬한 압착 및 비정상 전단 하중</strong>이 일시 수렴하여 척추 추간판 파열 및 만성 염증을 강제 유발합니다.
                </p>
              </div>

              {/* 2. 각 스트레칭 별 작용 부위 및 효과 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="font-black text-slate-950 text-sm mb-2 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs w-5 h-5 rounded-full inline-flex items-center justify-center font-bold">2</span>
                  각 스트레칭 별 작용 부위 및 효과
                </p>
                <div className="pl-7 space-y-2 text-slate-600">
                  <p>🔹 <strong className="text-slate-900">발목 관절 (Ankle Joint):</strong> 스쿼트 하강 시 가자미근 및 아킬레스건을 활성화하여 뒤꿈치가 뜨는 현상을 제거하고 상체 숙여짐을 예방합니다.</p>
                  <p>🔹 <strong className="text-slate-900">고관절 (Hip Joint):</strong> 장요근 및 이상근의 가동각을 복원하여 스쿼트 깊은 하강 시 꼬리뼈가 아래로 무너지는 벗윙크 현상을 원천 방지합니다.</p>
                  <p>🔹 <strong className="text-slate-900">어깨 관절 (Shoulder Joint):</strong> 상완골과 견갑골 사이의 충돌을 예방하고, 회전근개 내부 윤활 작용을 유도하여 견봉하 충돌증후군을 완화합니다.</p>
                </div>
              </div>

              {/* 3. 올바르지 못한 스트레칭으로 인한 부상 사고 데이터 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="font-black text-slate-950 text-sm mb-2 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs w-5 h-5 rounded-full inline-flex items-center justify-center font-bold">3</span>
                  올바르지 못한 스트레칭으로 인한 부상 사고 데이터
                </p>
                <div className="pl-7 text-slate-600 space-y-1.5">
                  <p>⚠️ 충분한 발목 예열 없이 무리한 점진적 스프린트나 가속 리프팅을 강행할 경우 <strong className="text-rose-600">아킬레스건의 미세 부하 파열 및 만성 건염</strong>이 임상적으로 흔히 초래됩니다.</p>
                  <p>⚠️ 고관절 유연성이 잠겨있는 상태에서 단지 무게 욕심으로 무리한 하프 또는 풀스쿼트 볼륨을 강행 시, 중량이 일시적으로 요추 4, 5번에 실리며 <strong className="text-rose-600">급성 인대 및 척추 기립근 손상</strong>을 발생시킵니다.</p>
                </div>
              </div>

            </div>
          </div>
        </main>
      )}

      {/* ==========================================
          [C] 뷰 2: 메인창 (두 개의 폴드 영역 분할 구조)
          ========================================== */}
      {currentView === 'main' && (
        <div className="flex-1 flex flex-col w-full animate-fadeIn">
          
          {/* [Top Fold] - 오직 운동 전/후 가이드 게이트웨이만 노출되는 대형 영역 */}
          <section id="top-fold-gate" className="min-h-[calc(100vh-70px)] bg-white flex flex-col justify-center items-center px-4 py-8 border-b border-slate-100">
            <div className="max-w-4xl w-full text-center space-y-10">
              <div className="space-y-4">
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  GATEWAY AREA
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                  현재 어떤 스트레칭 가이드가 필요하십니까?
                </h2>
                <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                  원하는 시점의 타겟 카드를 클릭하시면 해당 조건 데이터가 사전 입력(Pre-fill) 처리된 상태로 전용 상세 처방 제어창으로 즉시 전환됩니다.
                </p>
              </div>

              {/* 1, 2번 구역 독립 대형 진입 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto px-2">
                <div 
                  onClick={() => openGuideWindow('before')}
                  className="group bg-slate-50 hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-500 p-6 md:p-8 rounded-2xl cursor-pointer text-left transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between min-h-[190px]"
                >
                  <div>
                    <span className="text-3xl filter drop-shadow">🔥</span>
                    <h3 className="font-black text-slate-950 text-lg mt-4 group-hover:text-emerald-600 transition-all">
                      1. 운동 전 스트레칭 가이드
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 font-medium">
                      정적 훈련 시 발생하는 순간 근동원력 2.5% 상실을 예방하기 위한 안전 관절 웜업 루틴으로 진입합니다.
                    </p>
                  </div>
                  <span className="text-xs font-black text-emerald-500 text-right mt-6 block group-hover:translate-x-1 transition-transform">
                    처방 새 창 열기 &rarr;
                  </span>
                </div>

                <div 
                  onClick={() => openGuideWindow('after')}
                  className="group bg-slate-50 hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-500 p-6 md:p-8 rounded-2xl cursor-pointer text-left transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between min-h-[190px]"
                >
                  <div>
                    <span className="text-3xl filter drop-shadow">🧘‍♀️</span>
                    <h3 className="font-black text-slate-950 text-lg mt-4 group-hover:text-emerald-600 transition-all">
                      2. 운동 후 스트레칭 가이드
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 font-medium">
                      과긴장 수축된 타겟 근섬유를 원래 길이로 복구하고 교감신경계 활성을 부드럽게 안정시키는 쿨다운 루틴으로 진입합니다.
                    </p>
                  </div>
                  <span className="text-xs font-black text-emerald-500 text-right mt-6 block group-hover:translate-x-1 transition-transform">
                    처방 새 창 열기 &rarr;
                  </span>
                </div>
              </div>

              {/* 스크롤 유도 신호 */}
              <div className="pt-6 text-slate-400 text-xs font-black animate-bounce select-none">
                <span>창을 아래로 스크롤하면 해부학 & 임상 아카이브 영역이 보입니다</span>
                <span className="block text-base mt-2">&darr;</span>
              </div>
            </div>
          </section>

          {/* [Bottom Fold] - 아래로 내려야 활성화되는 3, 4번 전문 데이터 지식방 영역 */}
          <section id="bottom-fold-archive" className="bg-slate-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* [3구역] 각 스트레칭별 작용 부위 및 효과 (5/12) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[390px]">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">📍 AREA 03. 관절별 해부학 정보실</h3>
                    <h4 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3">각 스트레칭별 작용 부위 및 효과 지표</h4>
                    
                    <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/40 my-4">
                      {Object.keys(JOINT_EFFECTS_DATA).map((key) => (
                        <button
                          key={key}
                          onClick={() => setSelectedJoint(key)}
                          className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${selectedJoint === key ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {key === 'ankle' ? '발목 관절' : key === 'hip' ? '고관절' : '어깨 관절'}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 animate-fadeIn text-xs">
                      <p className="font-black text-slate-900 text-sm font-mono">{JOINT_EFFECTS_DATA[selectedJoint].name}</p>
                      <p className="p-2.5 bg-emerald-50 text-emerald-900 font-bold rounded-lg text-xs tracking-tight">
                        {JOINT_EFFECTS_DATA[selectedJoint].rom}
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        <strong className="text-slate-800 font-bold">훈련 효과:</strong> {JOINT_EFFECTS_DATA[selectedJoint].effect}
                      </p>
                      <p className="p-2.5 bg-rose-50 text-rose-700 rounded-lg leading-relaxed text-xs">
                        <strong className="text-rose-900 font-black block mb-0.5">⚠️ 보상작용 리스크:</strong> 
                        {JOINT_EFFECTS_DATA[selectedJoint].risk}
                      </p>
                    </div>
                  </div>

                  {/* 피드백 반영: 자세히 보기 버튼 탑재 */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedJointDetail(selectedJoint)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                    >
                      <span>🔍 {JOINT_EFFECTS_DATA[selectedJoint].name.split(' ')[0]} 해부학 상세 지침 보기</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* [4구역] 올바르지 못한 스트레칭으로 인한 사고 데이터 (7/12) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs min-h-[390px]">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">🚨 AREA 04. 리스크 아카이브</h3>
                <h4 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3">올바르지 못한 스트레칭으로 인한 부상 사고 데이터</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  {ACCIDENT_ARCHIVE_DATA.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-150 flex flex-col justify-between text-xs min-h-[250px]">
                      <div>
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md">
                          임상 사고 통계 0{item.id}
                        </span>
                        <h5 className="font-black text-slate-900 mt-3 text-sm">{item.title}</h5>
                        <p className="text-slate-500 leading-relaxed mt-2">
                          <strong className="text-slate-800 font-bold">유발 상황:</strong> {item.cause}
                        </p>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-200/80">
                        <p className="text-slate-600 leading-relaxed text-[11px] italic mb-3">
                          <strong className="text-rose-700 font-bold">역학 파열 기전:</strong> {item.mechanism}
                        </p>
                        
                        {/* 피드백 반영: 자세히 보기 버튼 탑재 */}
                        <button
                          onClick={() => setSelectedAccidentDetail(item.id)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-[10px] transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                        >
                          🚑 통계 0{item.id} 임상 재활 프로토콜 보기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </div>
      )}

      {/* ==========================================
          [E] 팝업 모달 1: 관절별 해부학 상세 정보창
          ========================================== */}
      {selectedJointDetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔬</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{JOINT_EFFECTS_DATA[selectedJointDetail].name} 상세</h3>
                  <p className="text-[10px] text-slate-400">생체역학적 기능 평가 및 자가 측정 가이드</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJointDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-black p-2 rounded-xl bg-slate-50 text-xs transition-all"
              >
                닫기 ✕
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs text-slate-600 leading-relaxed">
              
              {/* 자가테스트 가이드 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <p className="font-black text-slate-900 text-xs flex items-center gap-1.5 mb-1.5">
                  <span className="text-emerald-500">📏</span> 1단계: 임상 자가진단 (Self-Assessment)
                </p>
                <p className="text-slate-700 font-bold mb-1">{JOINT_EFFECTS_DATA[selectedJointDetail].details.testName}</p>
                <p className="text-slate-500 text-[11px]">{JOINT_EFFECTS_DATA[selectedJointDetail].details.testGuide}</p>
              </div>

              {/* 생체역학 전문 주해 */}
              <div>
                <p className="font-black text-slate-900 text-xs mb-1">🔍 역학적 해설 및 보상작용 기전</p>
                <p className="pl-1 text-slate-600">{JOINT_EFFECTS_DATA[selectedJointDetail].details.clinicalNote}</p>
              </div>

              {/* 재활 및 가동성 회복 훈련 팁 */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                <p className="font-black text-emerald-950 text-xs mb-1 flex items-center gap-1">
                  💡 처방적 관절 기동성 향상 가이드
                </p>
                <p className="text-emerald-900 font-medium">{JOINT_EFFECTS_DATA[selectedJointDetail].details.rehabTips}</p>
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedJointDetail(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all active:scale-95"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          [F] 팝업 모달 2: 임상 부상 사고 상세 정보창
          ========================================== */}
      {selectedAccidentDetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-150 max-h-[90vh] overflow-y-auto">
            
            {/* 임상 모달 헤더 */}
            {(() => {
              const accident = ACCIDENT_ARCHIVE_DATA.find(a => a.id === selectedAccidentDetail);
              return (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚑</span>
                      <div>
                        <h3 className="font-black text-rose-900 text-base">{accident.title}</h3>
                        <p className="text-[10px] text-slate-400">정밀 역학 임상 사고 분석실</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAccidentDetail(null)}
                      className="text-slate-400 hover:text-slate-600 font-black p-2 rounded-xl bg-slate-50 text-xs transition-all"
                    >
                      닫기 ✕
                    </button>
                  </div>

                  <div className="mt-5 space-y-5 text-xs text-slate-600 leading-relaxed">
                    
                    {/* 예상 회복 기간 */}
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3">
                      <span className="text-xl">📅</span>
                      <div>
                        <p className="font-black text-rose-950 text-xs">임상적 통상 예상 회복 기간 (Recovery Period)</p>
                        <p className="text-rose-800 font-bold mt-0.5">{accident.details.recoveryTime}</p>
                      </div>
                    </div>

                    {/* 무조건 사수할 절대 안전 체크리스트 */}
                    <div>
                      <p className="font-black text-slate-900 text-xs mb-2">📌 운동 진행 시 무조건 지켜야 할 3대 안전 수칙</p>
                      <ul className="space-y-2 pl-1">
                        {accident.details.warningList.map((warn, i) => (
                          <li key={i} className="flex gap-2 items-start text-[11px]">
                            <span className="text-rose-500 font-bold font-mono">[{i + 1}]</span>
                            <span className="text-slate-600">{warn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 정밀 재활 솔루션 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <p className="font-black text-slate-900 text-xs flex items-center gap-1.5 mb-1.5">
                        ⚙️ 회복 촉진을 위한 능동 재활 프로토콜
                      </p>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{accident.details.rehabSolution}</p>
                    </div>

                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setSelectedAccidentDetail(null)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
                    >
                      이해했습니다 (닫기)
                    </button>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}

      {/* ==========================================
          [D] 뷰 3: 전용 스트레칭 가이드 상세 창 (새 창 구조)
          ========================================== */}
      {currentView === 'guide-detail' && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 animate-fadeIn">
          
          {/* 대형 배너: 기본 데이터 자동 입력 증거 */}
          <div className="bg-slate-950 text-white p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-lg border border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                System Pre-filled Matrix
              </span>
              <h2 className="text-xl font-black mt-2 text-white">
                {prefilledTiming === 'before' ? '🔥 운동 전 동적 웜업 가이드 전용 창' : '🧘‍♀️ 운동 후 정적 쿨다운 이완 전용 창'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">메인 게이트에서의 선택 조건값이 시스템에 기저 고정되어 사전 연동되었습니다.</p>
            </div>
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-black px-4 py-2.5 rounded-xl text-xs transition-all border border-white/10"
            >
              &larr; 게이트로 복귀
            </button>
          </div>

          {/* 세부 변수 입력 영역 (새 창 내부에서의 부위 커스텀 선택 기능) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">상세 타겟 근골격계 부위를 지정해 주세요:</label>
              <p className="text-[11px] text-slate-400">부위가 입력되어야 하단의 비디오 및 동작 리스트가 바인딩됩니다.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSelectedTarget('upper'); resetTimer(); }}
                className={`py-3 rounded-xl border text-xs font-bold transition-all active:scale-[0.98] ${selectedTarget === 'upper' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
              >
                💪 상체 (Upper)
              </button>
              <button
                onClick={() => { setSelectedTarget('lower'); resetTimer(); }}
                className={`py-3 rounded-xl border text-xs font-bold transition-all active:scale-[0.98] ${selectedTarget === 'lower' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
              >
                🦵 하체 (Lower)
              </button>
            </div>
          </div>

          {/* 조건 조합에 따른 처방 메인 패널 */}
          {!prescription ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center text-slate-400 min-h-[300px] flex flex-col items-center justify-center shadow-xs">
              <span className="text-5xl mb-3 block animate-pulse">🎯</span>
              <h4 className="font-black text-slate-800 text-sm">근골격계 단련 타겟 부위를 골라주세요</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                상단 우측에서 상체 또는 하체 버튼을 터치해 주시면 생체역학적 원리 텍스트, 체크리스트, 외부 검증 유튜브 Iframe 미디어가 실시간 조립 처방됩니다.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              
              <div className="border-b border-slate-100 pb-5">
                <h3 className="text-lg font-black text-slate-950">{STRETCH_RESOURCES[prefilledTiming].title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  <strong className="text-slate-800 font-bold block mb-1">생리역학 분석 지침:</strong>
                  {STRETCH_RESOURCES[prefilledTiming].mechanism}
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200/40 text-amber-900 text-xs rounded-2xl leading-relaxed">
                {STRETCH_RESOURCES[prefilledTiming].warning}
              </div>

              {/* 2단 그리드 루틴 시연 보드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* 왼쪽: 동작 가이드라인 목록 */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">📋 처방 동작 가이드라인 및 완료 체크</h4>
                  <p className="text-sm font-black text-slate-900">{prescription.routineName}</p>
                  
                  <div className="space-y-3">
                    {prescription.steps.map((step, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs shadow-xs">
                        <strong className="text-slate-950 font-black block text-sm"><span className="text-emerald-500 mr-2">✔</span>{step.name}</strong>
                        <p className="text-slate-500 leading-relaxed mt-2">{step.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* 시간 입력 및 실시간 제어 카운트다운 타이머 */}
                  <div className="bg-slate-950 text-white p-5 rounded-2xl flex items-center justify-between gap-4 mt-4 shadow-md border border-slate-850">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">세션 타이머 제어</span>
                      <span className="text-lg font-black text-emerald-400 font-mono tracking-tight">{timeLeft}초 남음</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!timerActive ? (
                        <button onClick={startTimer} className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition-all">
                          시작
                        </button>
                      ) : (
                        <button onClick={pauseTimer} className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition-all">
                          일시정지
                        </button>
                      )}
                      <button onClick={resetTimer} className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
                        리셋
                      </button>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 검증 완료된 Iframe 비디오 */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">📺 라이브 큐레이션 매칭 영상</h4>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-sm">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={prescription.videoUrl}
                      title="Stretching Details"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/50 text-xs">
                    <span className="font-black text-emerald-900 block mb-1">💡 생체역학 단서:</span>
                    <span className="text-slate-600 leading-relaxed text-[11px]">{prescription.cues}</span>
                  </div>
                </div>

              </div>

            </div>
          )}
        </main>
      )}

      {/* 글로벌 푸터 고정 */}
      <footer className="bg-white border-t border-slate-150 py-8 px-6 text-center text-xs text-slate-400 mt-auto">
        <p className="font-black text-slate-600">
          프로그래밍 기초 및 실습 기말 과제물 최종본
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Copyright © {new Date().getFullYear()} Lim Se-bin. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}