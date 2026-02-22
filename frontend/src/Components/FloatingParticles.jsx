import React, { useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadAll } from "@tsparticles/all";
import { useEffect, useState } from "react";

export default function FloatingParticles() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadAll(engine);
        }).then(() => setInit(true));
    }, []);

    return init ? (
        <Particles
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,          // ✅ no "px", just a number
                pointerEvents: "none"  // ✅ this is the key fix — lets clicks pass through
            }} options={{
                background: { color: "transparent" },
                particles: {
                    number: { value: 100 },
                    shape: {
                        type: "image",
                        options: {
                            image: [
                                {
                                    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='%23a8d5a2' stroke-width='3'><ellipse cx='50' cy='30' rx='10' ry='18'/><ellipse cx='70' cy='44' rx='10' ry='18' transform='rotate(60 70 44)'/><ellipse cx='70' cy='70' rx='10' ry='18' transform='rotate(120 70 70)'/><ellipse cx='50' cy='80' rx='10' ry='18'/><ellipse cx='30' cy='70' rx='10' ry='18' transform='rotate(60 30 70)'/><ellipse cx='30' cy='44' rx='10' ry='18' transform='rotate(120 30 44)'/><circle cx='50' cy='55' r='8'/></g></svg>`,
                                    width: 100,
                                    height: 100,
                                },
                                {
                                    src: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='%23b8e0b2' stroke-width='2'><path d='M50 10 Q65 30 50 50 Q35 30 50 10'/><path d='M90 50 Q70 65 50 50 Q70 35 90 50'/><path d='M50 90 Q35 70 50 50 Q65 70 50 90'/><path d='M10 50 Q30 35 50 50 Q30 65 10 50'/></g></svg>`,
                                    width: 100,
                                    height: 100,
                                }
                            ]
                        }
                    },
                    size: { value: { min: 15, max: 35 } },
                    opacity: { value: { min: 0.2, max: 0.2 } },   // very subtle
                    move: {
                        enable: true,
                        speed: 0.8,
                        direction: "top",
                        outModes: "out",
                        random: true,
                        straight: false,
                        warp: false,
                    },
                    rotate: {
                        value: { min: 0, max: 360 },
                        animation: { enable: true, speed: 2 }
                    },
                },
            }}
        />
    ) : null;
}