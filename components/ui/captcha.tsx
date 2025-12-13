"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CaptchaProps {
  onValidChange?: (valid: boolean) => void
}

export function Captcha({ onValidChange }: CaptchaProps) {
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

  return (
    <div className="space-y-2">
      <Label>Captcha (arithmetic): enter the result of {a} {op} {b}</Label>
      <Input
        type="number"
        inputMode="numeric"
        placeholder="Enter the calculation result"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <p className={`text-sm ${valid ? "text-green-600" : "text-red-600"}`}>
        {valid ? "Verified" : "Incorrect result, please try again"}
      </p>
    </div>
  )
}
