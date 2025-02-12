"use client";

import { useEffect, useRef } from "react";
import { kml } from "@tmcw/togeojson";

export default function GlobeComponent() {
  const globeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // We only want to run once in the client
    if (!globeRef.current) return;

    (async () => {
      // Dynamically import globe.gl in the browser
      const GlobeLib = (await import("globe.gl")).default;

      // Initialize the globe
      const globe = new GlobeLib(globeRef.current!)
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
        .showAtmosphere(true)
        .atmosphereColor("#3f9fff")
        .atmosphereAltitude(0.25);

      // Optional auto-rotate
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.35;

      // ------------------------------------------------------------------
      // 1) Fetch and parse all KML files
      // ------------------------------------------------------------------
      const fetchPromises: Promise<string>[] = [];
      for (let i = 1; i <= 53; i++) {
        const url = `/kml_files/PA${i}.kml`;
        fetchPromises.push(fetch(url).then((r) => r.text()));
      }
      const kmlTexts = await Promise.all(fetchPromises);

      // ------------------------------------------------------------------
      // 2) Convert KML -> GeoJSON and aggregate all features
      // ------------------------------------------------------------------
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const allFeatures: any[] = [];
      kmlTexts.forEach((kmlString) => {
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlString, "application/xml");
        const geojson = kml(kmlDoc); // converts KML -> GeoJSON
        if (geojson.features) {
          allFeatures.push(...geojson.features);
        }
      });

      console.log(allFeatures);

      // ------------------------------------------------------------------
      // 3) Render polygons on the globe
      // ------------------------------------------------------------------
      // globe
      //   .polygonsData(allFeatures)
      //   .polygonCapColor(() => "rgba(255, 0, 0, 0.3)")     // "foggy" red fill
      //   .polygonSideColor(() => "rgba(255, 0, 0, 0.2)")   // semi-transparent sides
      //   .polygonStrokeColor(() => "#111")                 // outline color
      //   .polygonsTransitionDuration(200);                 // animate transitions

    })();
  }, []);

  return (
    <div className="w-full h-[600px] md:h-screen">
      <div ref={globeRef} className="w-full h-full" />
    </div>
  );
}
