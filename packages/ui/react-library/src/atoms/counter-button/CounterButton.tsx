import * as React from "react";
import './CounterButton.module.css';

export const CounterButton = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="counter-button">
      <p>
        This component is from{" "}
        <code>
          ui
        </code>
      </p>
      <div>
        <button className="counter"
          type="button"
          onClick={() => setCount((c) => c + 1)}
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
};
