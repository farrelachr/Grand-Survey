/**
 * Chart Export Utility
 * Exports SVG/Recharts charts to high-resolution PNG images with header titles and branding,
 * copying directly to the system clipboard or downloading as PNG.
 */

export interface ExportChartOptions {
  containerElement: HTMLElement;
  title: string;
  categoryLabel?: string;
  metaText?: string;
  filename?: string;
}

/**
 * Inlines computed styles to an SVG clone so it renders accurately onto an HTML Canvas.
 */
function cloneSvgWithStyles(svg: SVGSVGElement): SVGSVGElement {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const originalElements = [svg, ...Array.from(svg.querySelectorAll("*"))];
  const clonedElements = [clonedSvg, ...Array.from(clonedSvg.querySelectorAll("*"))];

  for (let i = 0; i < originalElements.length; i++) {
    const orig = originalElements[i] as HTMLElement | SVGElement;
    const clone = clonedElements[i] as HTMLElement | SVGElement;
    if (orig && clone && orig.nodeType === Node.ELEMENT_NODE) {
      const computed = window.getComputedStyle(orig);
      if (computed.fill && computed.fill !== "none") clone.setAttribute("fill", computed.fill);
      if (computed.stroke && computed.stroke !== "none") clone.setAttribute("stroke", computed.stroke);
      if (computed.strokeWidth) clone.setAttribute("stroke-width", computed.strokeWidth);
      if (computed.fontFamily) clone.style.fontFamily = computed.fontFamily;
      if (computed.fontSize) clone.style.fontSize = computed.fontSize;
      if (computed.fontWeight) clone.style.fontWeight = computed.fontWeight;
    }
  }

  // Add crisp white background
  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("width", "100%");
  bgRect.setAttribute("height", "100%");
  bgRect.setAttribute("fill", "#ffffff");
  clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

  return clonedSvg;
}

/**
 * Wraps text into lines based on canvas maxWidth.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Renders the chart and decorative title header into an HTML Canvas.
 */
async function renderChartToCanvas(options: ExportChartOptions): Promise<HTMLCanvasElement> {
  const { containerElement, title, categoryLabel, metaText } = options;
  const svg = containerElement.querySelector("svg.recharts-surface") as SVGSVGElement | null;
  if (!svg) {
    throw new Error("Grafik SVG tidak ditemukan dalam kontainer.");
  }

  const svgWidth = svg.clientWidth || parseFloat(svg.getAttribute("width") || "700");
  const svgHeight = svg.clientHeight || parseFloat(svg.getAttribute("height") || "300");

  const clonedSvg = cloneSvgWithStyles(svg);
  clonedSvg.setAttribute("width", String(svgWidth));
  clonedSvg.setAttribute("height", String(svgHeight));

  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  const imageLoadPromise = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Gagal memuat grafik SVG ke dalam citra kanvas."));
  });
  img.src = svgUrl;
  await imageLoadPromise;

  // Canvas layout dimensions
  const scale = 2; // Retina resolution
  const paddingX = 36;
  const paddingTop = 40;
  const paddingBottom = 30;

  const canvasWidth = Math.max(760, svgWidth + paddingX * 2);

  // Setup temporary canvas to measure wrapped title height
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.font = "bold 18px Inter, system-ui, -apple-system, sans-serif";
  const titleLines = wrapText(tempCtx, title, canvasWidth - paddingX * 2);
  const titleLineHeight = 26;
  const headerHeight = paddingTop + 20 + titleLines.length * titleLineHeight + 16;
  const footerHeight = 44;

  const canvasHeight = headerHeight + svgHeight + footerHeight + paddingBottom;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Gagal menginisialisasi 2D Canvas context.");

  ctx.scale(scale, scale);

  // 1. White Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Subtle Card Border
  ctx.strokeStyle = "#E1E5DF";
  ctx.lineWidth = 1;
  ctx.strokeRect(1, 1, canvasWidth - 2, canvasHeight - 2);

  // 3. Top Accent Bar (HIMALKOM Forest Green)
  ctx.fillStyle = "#174C3C";
  ctx.fillRect(0, 0, canvasWidth, 5);

  let currentY = paddingTop;

  // 4. Category Badge / Label
  if (categoryLabel) {
    ctx.font = "bold 11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#174C3C";
    ctx.fillText(categoryLabel.toUpperCase(), paddingX, currentY);
    currentY += 18;
  }

  // 5. Title
  ctx.font = "bold 17px Inter, system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#202522";
  for (const line of titleLines) {
    ctx.fillText(line, paddingX, currentY);
    currentY += titleLineHeight;
  }

  // 6. Header Divider Line
  currentY += 8;
  ctx.strokeStyle = "#E1E5DF";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(paddingX, currentY);
  ctx.lineTo(canvasWidth - paddingX, currentY);
  ctx.stroke();

  // 7. Render SVG Chart
  currentY += 12;
  const chartOffsetX = Math.max(paddingX, (canvasWidth - svgWidth) / 2);
  ctx.drawImage(img, chartOffsetX, currentY, svgWidth, svgHeight);
  URL.revokeObjectURL(svgUrl);

  // 8. Footer Line & Branding
  const footerY = canvasHeight - paddingBottom;
  ctx.strokeStyle = "#E1E5DF";
  ctx.beginPath();
  ctx.moveTo(paddingX, footerY - 14);
  ctx.lineTo(canvasWidth - paddingX, footerY - 14);
  ctx.stroke();

  ctx.font = "500 11px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#737A74";
  ctx.fillText("Grand Survey HIMALKOM IPB 2026", paddingX, footerY + 4);

  if (metaText) {
    const metaWidth = ctx.measureText(metaText).width;
    ctx.fillText(metaText, canvasWidth - paddingX - metaWidth, footerY + 4);
  }

  return canvas;
}

/**
 * Copies the chart as a high-resolution PNG image directly to the clipboard.
 * Falls back to auto-download if clipboard image access is unavailable.
 */
export async function copyChartAsImage(options: ExportChartOptions): Promise<"copied" | "downloaded"> {
  const canvas = await renderChartToCanvas(options);

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Gagal menghasilkan berkas gambar PNG."));
        return;
      }

      // Try copying directly to clipboard
      if (typeof navigator !== "undefined" && navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          resolve("copied");
          return;
        } catch {
          // Fall through to download fallback
        }
      }

      // Fallback: Download file
      const cleanFilename = (options.filename || options.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chart-${cleanFilename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve("downloaded");
    }, "image/png");
  });
}

/**
 * Copies question summary data as formatted text/markdown table to clipboard.
 */
export async function copyChartDataAsText(
  title: string,
  data: Array<{ name: string; count: number; percentage: number }>
): Promise<void> {
  const rows = data.map((d) => `- ${d.name}: ${d.count} (${d.percentage}%)`).join("\n");
  const text = `${title}\n${rows}\n\nSumber: Grand Survey HIMALKOM 2026`;
  await navigator.clipboard.writeText(text);
}

