import React, { useRef, useEffect, useState } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.fillStyle = bgColor;
    ctx.lineWidth = lineWidth;

    // Fill background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctxRef.current = ctx;
  }, []); // run once

  // Update strokeStyle and fillStyle when color or background changes
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.fillStyle = bgColor;
    }
  }, [color, bgColor]);

  // Update lineWidth when changed
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  // Redraw background when bgColor changes
  useEffect(() => {
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.fillStyle = bgColor;
      ctxRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctxRef.current.strokeStyle = color; // reset stroke after fill
      ctxRef.current.fillStyle = bgColor;
    }
  }, [bgColor, color]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(lastPos.x, lastPos.y);
    ctxRef.current.lineTo(currentX, currentY);
    ctxRef.current.stroke();

    setLastPos({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctxRef.current.fillStyle = bgColor;
      ctxRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  return (
    <div className="flex flex-col items-center my-16 px-4">
      <h1 className="text-3xl font-bold mb-8 border-2 border-black rounded-md px-6 py-2">
        Signature App
      </h1>

      <div className="flex flex-wrap justify-center gap-12 max-w-4xl w-full mb-8">
        <div className="flex flex-col items-center">
          <label htmlFor="colorPicker" className="mb-1 font-semibold">
            Text Color Picker
          </label>
          <input
            id="colorPicker"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-24 h-10 cursor-pointer rounded-md border border-gray-400"
          />
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="canvasColor" className="mb-1 font-semibold">
            Background Color
          </label>
          <input
            id="canvasColor"
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-24 h-10 cursor-pointer rounded-md border border-gray-400"
          />
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="fontPicker" className="mb-1 font-semibold">
            Line Width
          </label>
          <select
            id="fontPicker"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="border-2 border-black rounded-md w-24 h-10 text-center cursor-pointer"
          >
            <option value={2}>2 px</option>
            <option value={4}>4 px</option>
            <option value={6}>6 px</option>
            <option value={8}>8 px</option>
            <option value={10}>10 px</option>
            <option value={15}>15 px</option>
          </select>
        </div>
      </div>

      <div className="border-2 border-black rounded-md overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          className="bg-white"
          style={{ display: "block", cursor: "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          width={800}
          height={500}
        />
      </div>

      <button
        type="button"
        onClick={handleClear}
        className="bg-red-600 hover:bg-red-500 text-white rounded-md h-10 px-16 mt-8 border-2 border-red-700 transition"
      >
        Clear
      </button>
    </div>
  );
};

export default App;
