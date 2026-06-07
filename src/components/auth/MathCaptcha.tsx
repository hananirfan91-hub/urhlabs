import { useState, useEffect } from 'react';

interface MathCaptchaProps {
  onVerify: (isValid: boolean, expectedAnswer: number, actualValue: string) => void;
  id?: string;
}

export default function MathCaptcha({ onVerify, id = 'captcha' }: MathCaptchaProps) {
  const [numA, setNumA] = useState(1);
  const [numB, setNumB] = useState(1);
  const [operation, setOperation] = useState<'add' | 'sub'>('add');
  const [userAnswer, setUserAnswer] = useState('');

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1; // 1-9
    const b = Math.floor(Math.random() * 9) + 1; // 1-9
    const ops: ('add' | 'sub')[] = ['add', 'sub'];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let finalA = a;
    let finalB = b;
    if (op === 'sub' && a < b) {
      finalA = b;
      finalB = a;
    }

    setNumA(finalA);
    setNumB(finalB);
    setOperation(op);
    setUserAnswer('');

    // Hydrate parent state with the actual expected answer immediately!
    const expected = op === 'add' ? finalA + finalB : finalA - finalB;
    onVerify(false, expected, '');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const getExpected = (): number => {
    return operation === 'add' ? numA + numB : numA - numB;
  };

  const handleChange = (val: string) => {
    setUserAnswer(val);
    const expected = getExpected();
    const isCorrect = parseInt(val) === expected;
    onVerify(isCorrect, expected, val);
  };

  return (
    <div id={`${id}-wrapper`} className="p-3 bg-dark-bg/50 border border-border-custom rounded-xl flex items-center justify-between gap-2.5 text-xs w-full shadow-inner">
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-display font-medium text-text-muted text-[10px] uppercase tracking-wider select-none">
          Verify:
        </span>
        <span className="font-mono text-sm font-bold text-secondary bg-card-bg/80 px-2.5 py-1.5 rounded-lg border border-border-custom select-none tracking-wide text-center min-w-[70px]">
          {numA}{operation === 'add' ? '+' : '-'}{numB}=
        </span>
      </div>
      
      <input
        id={id}
        type="number"
        required
        placeholder="Answer"
        value={userAnswer}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-1 min-w-[50px] px-2.5 py-1.5 font-mono text-center bg-dark-bg border border-border-custom rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-text-primary text-sm font-bold shadow-inner"
      />

      <button
        type="button"
        onClick={generateCaptcha}
        className="p-1 px-2 text-text-muted hover:text-primary hover:bg-card-bg/60 border border-border-custom/80 rounded-lg cursor-pointer shrink-0 transition-all flex items-center gap-1 font-mono text-[10px]"
        title="Generate New Equation"
      >
        <span>Refresh</span>
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
      </button>
    </div>
  );
}
