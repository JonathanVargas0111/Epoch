const fs = require('fs');
const { createCanvas } = require('canvas');

// Crear un canvas de 16x16 para el ícono
const canvas = createCanvas(16, 16);
const ctx = canvas.getContext('2d');

// Fondo transparente
ctx.clearRect(0, 0, 16, 16);

// Dibujar un reloj simple
ctx.fillStyle = '#ffffff';
ctx.beginPath();
ctx.arc(8, 8, 6, 0, Math.PI * 2);
ctx.fill();

ctx.strokeStyle = '#000000';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(8, 8, 6, 0, Math.PI * 2);
ctx.stroke();

// Manecillas
ctx.strokeStyle = '#000000';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(8, 8);
ctx.lineTo(8, 4);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(8, 8);
ctx.lineTo(11, 8);
ctx.stroke();

// Guardar
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('icon.png', buffer);

console.log('Icon created!');
