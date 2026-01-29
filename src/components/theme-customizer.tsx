"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Check } from "lucide-react";
import { useTheme } from '@/components/theme-provider';

const PRESET_COLORS = [
  { name: 'Default', hsl: '3 71% 41%' },
  { name: 'Orange', hsl: '24 94% 50%' },
  { name: 'Green', hsl: '142 71% 45%' },
  { name: 'Blue', hsl: '217 91% 60%' },
  { name: 'Purple', hsl: '262 84% 58%' },
  { name: 'Pink', hsl: '322 84% 58%' },
];

function hexToHsl(hex: string): string | null {
    if (!hex || typeof hex !== 'string') return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    if (!result) return null;

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}


export default function ThemeCustomizer() {
  const { primaryColor, setPrimaryColor } = useTheme();
  const [customColor, setCustomColor] = useState('');

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomColor(hex);
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
        const hsl = hexToHsl(hex);
        if (hsl) {
            setPrimaryColor(hsl);
        }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Theme Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Customize Theme</h4>
            <p className="text-sm text-muted-foreground">
              Adjust the primary color of the interface.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Preset Colors</Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <Button
                  key={color.name}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: `hsl(${color.hsl})` }}
                  onClick={() => setPrimaryColor(color.hsl)}
                >
                  {primaryColor === color.hsl && <Check className="h-4 w-4 text-white" />}
                  <span className="sr-only">{color.name}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="custom-color">Custom Color</Label>
            <Input
              id="custom-color"
              value={customColor}
              onChange={handleCustomColorChange}
              placeholder="#A14827"
              className="h-8"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
