import { useEffect, useRef } from "react";

export function FinanceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Símbolos Flutuantes discretos ao fundo
    const symbolsList = ["$", "€", "£", "₳", "%", "▲", "▼", "₿", "+2.4%"];
    const floatingSymbols = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      text: symbolsList[Math.floor(Math.random() * symbolsList.length)],
      size: Math.random() * 12 + 10,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.2 + 0.05
    }));

    let step = 0;

    // Velas de Mercado (Candlesticks) - Cor fixa do FinTrack #FF9B03
    const candleWidth = 26;
    const candleGap = 12;
    const candleCount = Math.floor(width / (candleWidth + candleGap)) + 2;

    const candlesticks = Array.from({ length: candleCount }, (_, i) => ({
      x: i * (candleWidth + candleGap) + 15,
      open: Math.random() * 180 + 120,
      close: Math.random() * 180 + 120,
      high: 0,
      low: 0,
      isBullish: Math.random() > 0.4
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. ONDAS DE TENDÊNCIA DE FUNDO
      const drawWave = (baseY: number, amplitude: number, freq: number, spd: number, opacityMultiplier: number) => {
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#FF9B03";
        ctx.globalAlpha = opacityMultiplier;

        for (let x = 0; x <= width; x += 15) {
          const y = baseY + Math.sin(x * freq + step * spd) * amplitude + Math.cos(x * 0.003 + step * 0.3) * (amplitude * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, baseY - amplitude, 0, height);
        grad.addColorStop(0, "rgba(255, 155, 3, 0.05)");
        grad.addColorStop(1, "rgba(11, 15, 25, 0)");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      };

      drawWave(height * 0.65, 45, 0.002, 0.001, 0.25);
      drawWave(height * 0.80, 55, 0.0015, 0.0008, 0.15);
      step += 0.1;

      // 2. SÍMBOLOS FLUTUANTES
      floatingSymbols.forEach((sym) => {
        sym.y += sym.speedY * 0.3;
        sym.x += sym.speedX * 0.3;
        if (sym.y < -30) {
          sym.y = height + 20;
          sym.x = Math.random() * width;
        }
        ctx.font = `${sym.size}px sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${sym.opacity})`;
        ctx.fillText(sym.text, sym.x, sym.y);
      });

      // 3. VELAS DE MERCADO (PRIMEIRO PLANO)
      candlesticks.forEach((c) => {
        if (Math.random() < 0.03) {
          c.close += (Math.random() - 0.49) * 12;
          c.isBullish = c.close >= c.open;
        }
        c.high = Math.max(c.open, c.close) + Math.random() * 20;
        c.low = Math.min(c.open, c.close) - Math.random() * 20;

        const baseOffsetY = height * 0.50;
        const openY = baseOffsetY + (150 - c.open);
        const closeY = baseOffsetY + (150 - c.close);
        const highY = baseOffsetY + (150 - c.high);
        const lowY = baseOffsetY + (150 - c.low);

        const color = c.isBullish ? "#04eb51" : "#FF9B03";

        // Pavio da vela
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.65;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.x + candleWidth / 2, highY);
        ctx.lineTo(c.x + candleWidth / 2, lowY);
        ctx.stroke();

        // Corpo da vela
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 6);
        ctx.fillRect(c.x, bodyY, candleWidth, bodyHeight);

        // Borda do corpo da vela
        ctx.strokeStyle = c.isBullish ? "#1a9b00" : "#915700";
        ctx.lineWidth = 1;
        ctx.strokeRect(c.x, bodyY, candleWidth, bodyHeight);
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(11,15,25,0.3)_0%,rgba(11,15,25,0.85)_100%)]" />
    </>
  );
}