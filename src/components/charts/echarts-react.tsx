"use client";

import { useEffect, useRef } from "react";
import type { EChartsCoreOption, EChartsType } from "echarts/core";
import { echartsBaseOption } from "@/components/charts/chart-theme";

type EChartsReactProps = {
  option: EChartsCoreOption;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

/**
 * Wrapper ECharts chargé dynamiquement (pas dans le bundle initial du dashboard).
 */
export function EChartsReact({
  option,
  className,
  style,
  ariaLabel,
}: EChartsReactProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;

    async function mount() {
      const echarts = await import("echarts/core");
      const { LineChart, BarChart, PieChart } = await import("echarts/charts");
      const {
        GridComponent,
        TooltipComponent,
        LegendComponent,
        DataZoomComponent,
        VisualMapComponent,
      } = await import("echarts/components");
      const { CanvasRenderer } = await import("echarts/renderers");

      echarts.use([
        LineChart,
        BarChart,
        PieChart,
        GridComponent,
        TooltipComponent,
        LegendComponent,
        DataZoomComponent,
        VisualMapComponent,
        CanvasRenderer,
      ]);

      if (disposed || !hostRef.current) return;
      const chart = echarts.init(hostRef.current, undefined, {
        renderer: "canvas",
      });
      chartRef.current = chart;
      chart.setOption({ ...echartsBaseOption, ...option });

      resizeObserver = new ResizeObserver(() => {
        chart.resize();
      });
      resizeObserver.observe(hostRef.current);
    }

    void mount();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
    // Montage unique : les mises à jour d'option passent par l'effet suivant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chartRef.current?.setOption({ ...echartsBaseOption, ...option }, true);
  }, [option]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      chartRef.current?.setOption({
        animation: !media.matches,
      });
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: 280, ...style }}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
