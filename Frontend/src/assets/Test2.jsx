import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget({ symbol }) {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src ="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = 
    `
      {
        "symbol": "${symbol}",
        "width": 350,
        "height": 220,
        "locale": "en",
        "dateRange": "12M",
        "colorTheme": "dark",
        "isTransparent": false,
        "autosize": false,
        "largeChartUrl": ""
      }
    `;

    container.current.innerHTML = "";
    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

function Test2() {
  const symbols = ["FX:EURAUD", "FX:EURUSD", "FX:USDJPY"];

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {symbols.map((symbol) => (
        <TradingViewWidget key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}

export default memo(Test2);
