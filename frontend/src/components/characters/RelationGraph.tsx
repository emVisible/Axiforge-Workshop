import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useRelationGraph } from "@/hooks/useRelations";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  essence?: string;
  is_center: boolean;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  relation_name: string;
  is_mutual: boolean;
}

interface RelationGraphProps {
  characterId: string;
}

const COLORS = {
  background: "#f5f0e8",
  nodeCenter: "#2d2d2d",
  nodeOther: "#4a4a4a",
  nodeStroke: "#8b7355",
  linkLine: "#c44d4d",
  linkText: "#8b4513",
  pin: "#b8860b",
};

export default function RelationGraph({ characterId }: RelationGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useRelationGraph(characterId);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 400;

    d3.select(container).selectAll("svg").remove();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // 软木板背景
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", COLORS.background)
      .attr("rx", 16);

    // 纹理点
    for (let i = 0; i < 200; i++) {
      svg
        .append("circle")
        .attr("cx", Math.random() * width)
        .attr("cy", Math.random() * height)
        .attr("r", 0.5)
        .attr("fill", "#d4c5b2")
        .attr("opacity", 0.5);
    }

    // 转换数据
    const nodes: GraphNode[] = data.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      essence: n.essence,
      is_center: n.is_center,
    }));

    const links: GraphLink[] = data.links.map((l) => ({
      source: l.source,
      target: l.target,
      relation_name: l.relation_name,
      is_mutual: l.is_mutual,
    }));

    // 力导向模拟
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // 箭头标记
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", COLORS.linkLine)
      .attr("d", "M0,-4L8,0L0,4");

    // 连线
    const linkGroup = svg.append("g");

    const line = linkGroup
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(links)
      .join("line")
      .attr("stroke", COLORS.linkLine)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => (d.is_mutual ? "none" : "5,3"))
      .attr("opacity", 0.7)
      .attr("marker-end", (d) => (d.is_mutual ? null : "url(#arrow)"));

    const linkLabel = linkGroup
      .selectAll<SVGTextElement, GraphLink>("text")
      .data(links)
      .join("text")
      .text((d) => d.relation_name)
      .attr("font-size", "10px")
      .attr("fill", COLORS.linkText)
      .attr("text-anchor", "middle")
      .attr("dy", -6)
      .style("font-family", "'Georgia', serif")
      .style("font-style", "italic");

    // 节点
    const nodeGroup = svg.append("g");

    // 图钉
    const pins = nodeGroup
      .selectAll<SVGCircleElement, GraphNode>("circle.pin")
      .data(nodes)
      .join("circle")
      .attr("class", "pin")
      .attr("r", 4)
      .attr("fill", COLORS.pin)
      .attr("stroke", "#8b6914")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8);

    // 节点圆
    const circles = nodeGroup
      .selectAll<SVGCircleElement, GraphNode>("circle.node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", (d) => (d.is_center ? 22 : 16))
      .attr("fill", (d) => (d.is_center ? COLORS.nodeCenter : COLORS.nodeOther))
      .attr("stroke", COLORS.nodeStroke)
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .style("filter", "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))");

    // 节点文字
    const labels = nodeGroup
      .selectAll<SVGTextElement, GraphNode>("text.node-label")
      .data(nodes)
      .join("text")
      .attr("class", "node-label")
      .text((d) => (d.name.length > 6 ? d.name.slice(0, 6) + ".." : d.name))
      .attr("font-size", (d) => (d.is_center ? "10px" : "9px"))
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-weight", (d) => (d.is_center ? "bold" : "normal"))
      .style("pointer-events", "none")
      .style("font-family", "'Georgia', 'Noto Serif SC', serif");

    const drag = d3
      .drag<SVGCircleElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    circles.call(drag);

    // 缩放
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      });

    svg.call(zoom);
    // 点击跳转
    circles.on("click", (_, d) => {
      if (!d.is_center) {
        window.location.href = `/characters/${d.id}`;
      }
    });

    // 悬浮
    circles.on("mouseenter", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", (d: any) => (d.is_center ? 26 : 20));
    });
    circles.on("mouseleave", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", (d: any) => (d.is_center ? 22 : 16));
    });

    // tick 更新
    simulation.on("tick", () => {
      line
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      linkLabel
        .attr(
          "x",
          (d) => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2,
        )
        .attr(
          "y",
          (d) => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2,
        );

      pins.attr("cx", (d) => d.x!).attr("cy", (d) => d.y! - 20);

      circles.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  if (isLoading)
    return (
      <p className="text-sm text-gray-400 py-4 text-center">加载图谱...</p>
    );
  if (!data || data.nodes.length === 0) return null;

  return (
    <div ref={containerRef} className="w-full" style={{ minHeight: 400 }} />
  );
}
