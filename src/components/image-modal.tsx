import { useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageModalProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function ImageModal({ images = [], currentIndex, isOpen, onClose, onNavigate }: ImageModalProps) {
  const hasMultipleImages = images.length > 1
  const currentSrc = images[currentIndex] || ""

  // 이미지가 없으면 렌더링하지 않음
  if (!isOpen || images.length === 0) return null

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1)
    }
  }, [currentIndex, onNavigate])

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1)
    }
  }, [currentIndex, images.length, onNavigate])

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose, goToPrevious, goToNext])

  // Portal을 사용해서 body에 직접 렌더링
  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/80 backdrop-blur-sm",
        "animate-in fade-in duration-200"
      )}
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
        aria-label="닫기"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 이전 버튼 */}
      {hasMultipleImages && currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          className="absolute left-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
          aria-label="이전 이미지"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* 다음 버튼 */}
      {hasMultipleImages && currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          className="absolute right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
          aria-label="다음 이미지"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* 이미지 카운터 */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* 이미지 */}
      <img
        src={currentSrc}
        alt={`Image ${currentIndex + 1}`}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  )
}
