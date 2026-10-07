export interface GameBenchmark {
    game: string;
    fps: string;
    value: number; // For rendering visual percentage bars
}

export interface HardwareSpec {
    name: string;
    category: string;
    psuReq: number; // Watts
    pcieGen: string;
    vram: string;
    benchmarks: GameBenchmark[];
}

export const hardwareLookup: Record<string, HardwareSpec> = {
    "Sony PS5 Disc": {
        name: "Sony PS5 Disc",
        category: "consoles",
        psuReq: 350,
        pcieGen: "N/A",
        vram: "16GB GDDR6 (Shared)",
        benchmarks: [
            { game: "Cyberpunk 2077", fps: "60 FPS (Performance Mode)", value: 60 },
            { game: "GTA V", fps: "60 FPS (RT Fidelity)", value: 60 },
            { game: "Spider-Man 2", fps: "120 FPS (120Hz Mode)", value: 95 }
        ]
    },
    "Sony PS4 Pro": {
        name: "Sony PS4 Pro",
        category: "consoles",
        psuReq: 310,
        pcieGen: "N/A",
        vram: "8GB GDDR5",
        benchmarks: [
            { game: "Cyberpunk 2077", fps: "30 FPS (Dynamic 1080p)", value: 30 },
            { game: "GTA V", fps: "30 FPS (1440p High)", value: 30 },
            { game: "God of War", fps: "60 FPS (Performance Mode)", value: 60 }
        ]
    },
    "Xbox Series X": {
        name: "Xbox Series X",
        category: "consoles",
        psuReq: 315,
        pcieGen: "N/A",
        vram: "16GB GDDR6 (Shared)",
        benchmarks: [
            { game: "Cyberpunk 2077", fps: "60 FPS (Performance Mode)", value: 60 },
            { game: "GTA V", fps: "60 FPS (4K Ultra)", value: 60 },
            { game: "Forza Motorsport", fps: "60 FPS (Performance RT)", value: 90 }
        ]
    },
    "Nintendo Switch OLED": {
        name: "Nintendo Switch OLED",
        category: "consoles",
        psuReq: 39,
        pcieGen: "N/A",
        vram: "4GB LPDDR4X",
        benchmarks: [
            { game: "Zelda: Tears of the Kingdom", fps: "30 FPS (Docked 1080p)", value: 30 },
            { game: "Mario Kart 8 Deluxe", fps: "60 FPS (Docked 1080p)", value: 60 },
            { game: "Super Smash Bros", fps: "60 FPS (1080p Native)", value: 60 }
        ]
    },
    "Nvidia RTX 4090": {
        name: "Nvidia RTX 4090",
        category: "accessories", // Matches component categorizations
        psuReq: 850,
        pcieGen: "Gen 4.0 x16",
        vram: "24GB GDDR6X",
        benchmarks: [
            { game: "Cyberpunk 2077", fps: "120 FPS (Ultra RT, DLSS 3)", value: 100 },
            { game: "GTA V", fps: "185 FPS (Ultra 4K)", value: 100 },
            { game: "Valorant", fps: "450 FPS (Competitive 4K)", value: 100 }
        ]
    },
    "Nvidia RTX 3060": {
        name: "Nvidia RTX 3060",
        category: "accessories",
        psuReq: 600,
        pcieGen: "Gen 4.0 x16",
        vram: "12GB GDDR6",
        benchmarks: [
            { game: "Cyberpunk 2077", fps: "65 FPS (High 1080p, DLSS Q)", value: 65 },
            { game: "GTA V", fps: "115 FPS (Very High 1080p)", value: 85 },
            { game: "Valorant", fps: "280 FPS (Competitive 1080p)", value: 95 }
        ]
    }
};

// Default hardware spec fallback for custom graphics cards or unnamed components
export function getHardwareSpec(name: string): HardwareSpec {
    const cleanName = name.toLowerCase();
    
    // Direct matches
    for (const key of Object.keys(hardwareLookup)) {
        if (cleanName.includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName)) {
            return hardwareLookup[key];
        }
    }

    // Dynamic fallback generation based on search cues
    if (cleanName.includes("4070") || cleanName.includes("4080")) {
        return {
            name,
            category: "accessories",
            psuReq: 700,
            pcieGen: "Gen 4.0 x16",
            vram: cleanName.includes("4070") ? "12GB GDDR6X" : "16GB GDDR6X",
            benchmarks: [
                { game: "Cyberpunk 2077", fps: "95 FPS (Ultra RT, DLSS 3)", value: 95 },
                { game: "GTA V", fps: "150 FPS (Ultra 1440p)", value: 98 },
                { game: "Valorant", fps: "380 FPS (Competitive 1440p)", value: 100 }
            ]
        };
    }

    if (cleanName.includes("3070") || cleanName.includes("3080")) {
        return {
            name,
            category: "accessories",
            psuReq: 650,
            pcieGen: "Gen 4.0 x16",
            vram: cleanName.includes("3070") ? "8GB GDDR6" : "10GB GDDR6X",
            benchmarks: [
                { game: "Cyberpunk 2077", fps: "75 FPS (High RT, DLSS Q)", value: 75 },
                { game: "GTA V", fps: "130 FPS (Very High 1440p)", value: 90 },
                { game: "Valorant", fps: "320 FPS (Competitive 1440p)", value: 98 }
            ]
        };
    }

    // Default console fallback
    if (cleanName.includes("xbox")) {
        return hardwareLookup["Xbox Series X"];
    }
    if (cleanName.includes("switch")) {
        return hardwareLookup["Nintendo Switch OLED"];
    }
    if (cleanName.includes("ps5") || cleanName.includes("playstation 5")) {
        return hardwareLookup["Sony PS5 Disc"];
    }

    // Standard fallback specs
    return {
        name,
        category: "accessories",
        psuReq: 500,
        pcieGen: "Gen 3.0 / 4.0",
        vram: "8GB",
        benchmarks: [
            { game: "Cyberpunk 2077", fps: "50 FPS (Medium 1080p)", value: 50 },
            { game: "GTA V", fps: "80 FPS (High 1080p)", value: 70 },
            { game: "Valorant", fps: "200 FPS (Competitive 1080p)", value: 85 }
        ]
    };
}
