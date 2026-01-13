"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/lib/language-store"
import { translations } from "@/lib/translations"

interface CaptchaProps {
  onValidChange?: (valid: boolean) => void
}

export function Captcha({ onValidChange }: CaptchaProps) {
  const { language } = useLanguageStore()
  const t = translations[language]
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [op, setOp] = useState<"+" | "-">("+")
  const [answer, setAnswer] = useState("")

  const expected = useMemo(() => (op === "+" ? a + b : a - b), [a, b, op])
  const valid = useMemo(() => Number(answer) === expected, [answer, expected])

  useEffect(() => {
    const na = Math.floor(Math.random() * 10) + 1
    const nb = Math.floor(Math.random() * 10) + 1
    const nop: "+" | "-" = Math.random() > 0.5 ? "+" : "-"
    setA(na)
    setB(nb)
    setOp(nop)
  }, [])

  useEffect(() => {
    onValidChange?.(valid)
  }, [valid, onValidChange])

  const label = t.captchaLabel
    .replace("{a}", String(a))
    .replace("{op}", op)
    .replace("{b}", String(b))

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        inputMode="numeric"
        placeholder={t.captchaPlaceholder}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <p className={`text-sm ${valid ? "text-green-600" : "text-red-600"}`}>
        {valid ? t.captchaVerified : t.captchaIncorrect}
      </p>
    </div>
  )
}
