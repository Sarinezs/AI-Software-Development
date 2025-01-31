// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
    const container = useRef();

    useEffect(
        () => {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
            "width": "980",
            "height": "610",
            "autosize": true,
            "symbol": "FX:EURAUD",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "allow_symbol_change": false,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        }`;
            container.current.innerHTML = ""
            container.current.appendChild(script);
        },
        []
    );

    return (
        <>
            <div className="tradingview-widget-container" ref={container} >
                <div className="tradingview-widget-container__widget" ></div>
            </div>
        </>

    );
}

export default memo(TradingViewWidget);
