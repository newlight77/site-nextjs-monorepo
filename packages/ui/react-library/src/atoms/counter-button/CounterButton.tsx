import * as React from "react";
import './CounterButton.module.css';

type PropsButton = {
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  label?: string;
  children?: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const CounterButton: React.FC<PropsButton> = ({
  label,
  children,
  ...props
}: PropsButton) => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="counter-button">
      <p>
      {label}
      {children}
      </p>
      <div>
        <button className="counter"
          type="button"
          onClick={() => setCount((c) => c + 1)}
          {...props}
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
};
