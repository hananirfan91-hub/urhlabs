import { useState, useEffect } from 'react';

interface MathCaptchaProps {
  onVerify: (isValid: boolean, expectedAnswer: number) => void;
  id?: string;
}

export default function MathCaptcha({ onVerify, id = 'captcha' }: MathCaptchaProps) {
  const [numA, setNumA] = useState(1);
  const [numB, setNumB] = useState(1);
  const [operation, setOperation] = useState<'add' | 'sub'>('add');
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1; // 1-9
    const b = Math.floor(Math.random() * 9) + 1; // 1-9
    const ops: ('add' | 'sub')[] = ['add', 'sub'];
    const op = ops[Math.floor(Math.random() * ops.length)];

    // Prevent negative answers for simple user experience
    if (op === 'sub' && a < b) {
      setNumA(b);
      setNumB(a);
    } else {
      setNumA(a);
      setNumB(b);
    }
    setOperation(op);
    setUserAnswer('');
    setError(false);
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
    onVerify(isCorrect, expected);
  };

  return (
    <div id={`${id}-wrapper`} className="p-3 bg-card-bg rounded-lg border border-border-custom flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-display font-medium text-text-primary">
          Security Verification (Captcha)
        </label>
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-primary text-xs hover:underline bg-transparent border-0 cursor-pointer"
        >
          Generate New
        </button>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <span className="font-mono text-lg font-semibold tracking-wider text-secondary flex items-center select-none bg-dark-bg/50 px-3 py-1.5 rounded-md border border-border-custom/50">
          {numA} {operation === 'add' ? '+' : '-'} {numB} = ?
        </span>
        <input
          id={id}
          type="number"
          placeholder="Answer"
          value={userAnswer}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 px-3 py-1.5 font-mono bg-dark-bg border border-border-custom rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-text-primary"
        />
      </div>
      <p className="text-[11px] text-text-muted leading-tight">
        Solve the simple math equation to verify you are human (addition/subtraction, 1–9).
      </p>
    </div>
  );
}
