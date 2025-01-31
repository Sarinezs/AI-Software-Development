// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

function Test1() {
    const container = useRef();

    useEffect(
        () => {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
            {
                "colorTheme": "dark",
                "dateRange": "12M",
                "showChart": true,
                "locale": "en",
                "largeChartUrl": "",
                "isTransparent": false,
                "showSymbolLogo": true,
                "showFloatingTooltip": false,
                "width": "400",
                "height": "550",
                "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
                "plotLineColorFalling": "rgba(41, 98, 255, 1)",
                "gridLineColor": "rgba(42, 46, 57, 0)",
                "scaleFontColor": "rgba(209, 212, 220, 1)",
                "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
                "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
                "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
                "tabs": [
                    {
                    "title": "Forex",
                    "symbols": [
                        {
                        "s": "FX:EURUSD",
                        "d": "EUR to USD"
                        },
                        {
                        "s": "FX:USDJPY",
                        "d": "USD to JPY"
                        },
                        {
                        "s": "FX:EURAUD",
                        "d": "EUR to AUD"
                        }
                    ],
                    "originalTitle": "Forex"
                    }
                ]
            }`;
            container.current.innerHTML = ""
            container.current.appendChild(script);
        },
        []
    );

    return (
        <>

            <div className="tradingview-widget-container" ref={container}>
                <div className="tradingview-widget-container__widget"></div>
            </div>

        </>

    );
}

export default memo(Test1);
