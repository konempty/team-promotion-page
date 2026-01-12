
import { Button } from "@/components/ui/button"

interface QuestionPresetsProps {
  presets: { id: string; question: string; answer: string; image?: string; images?: string[] }[]
  onPresetClick: (preset: { id: string; question: string; answer: string; image?: string; images?: string[] }) => void
  isTyping: boolean
}

export default function QuestionPresets({ presets, onPresetClick, isTyping }: QuestionPresetsProps) {
  return (
    <div className="max-h-22.5 md:max-h-22.5 overflow-y-auto">
      <div className="flex flex-wrap gap-1.5 md:gap-2 max-w-full">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="secondary"
            size="sm"
            onClick={() => onPresetClick(preset)}
            disabled={isTyping}
            className="text-xs md:text-sm whitespace-nowrap"
          >
            {preset.question}
          </Button>
        ))}
      </div>
    </div>
  )
}
