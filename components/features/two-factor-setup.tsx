"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Copy, Download, CheckCircle, AlertTriangle, QrCode } from "lucide-react"
import { toast } from "sonner"

interface TwoFactorSetupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function TwoFactorSetup({ open, onOpenChange, onComplete }: TwoFactorSetupProps) {
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [backupCodes] = useState([
    "1a2b-3c4d-5e6f",
    "7g8h-9i0j-1k2l",
    "3m4n-5o6p-7q8r",
    "9s0t-1u2v-3w4x",
    "5y6z-7a8b-9c0d",
    "1e2f-3g4h-5i6j",
    "7k8l-9m0n-1o2p",
    "3q4r-5s6t-7u8v",
  ])

  // Mock QR code data
  const qrCodeSecret = "JBSWY3DPEHPK3PXP"
  const qrCodeUrl = `otpauth://totp/SecureTransfer:john@example.com?secret=${qrCodeSecret}&issuer=SecureTransfer`

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code")
      return
    }

    setIsVerifying(true)

    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock verification (accept any 6-digit code for demo)
      if (verificationCode.length === 6) {
        setStep(3)
        toast.success("Verification successful!")
      } else {
        toast.error("Invalid verification code")
      }
    } catch (error) {
      toast.error("Verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const downloadBackupCodes = () => {
    const content = `SecureTransfer Backup Codes
Generated: ${new Date().toLocaleDateString()}

Keep these codes safe! Each code can only be used once.

${backupCodes.join("\n")}

If you lose access to your authenticator app, you can use these codes to sign in.`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "securetransfer-backup-codes.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Backup codes downloaded!")
  }

  const handleComplete = () => {
    onComplete()
    setStep(1)
    setVerificationCode("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Set Up Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Secure your account with an additional layer of protection using an authenticator app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Download App */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 1: Download Authenticator App</CardTitle>
                <CardDescription>
                  Install an authenticator app on your mobile device to generate verification codes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Recommended Apps:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Google Authenticator</li>
                      <li>• Microsoft Authenticator</li>
                      <li>• Authy</li>
                      <li>• 1Password</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Time-based codes</li>
                      <li>• Offline generation</li>
                      <li>• Secure backup</li>
                      <li>• Multiple accounts</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> Make sure to download the app before proceeding to the next step.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>Continue</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Scan QR Code */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 2: Scan QR Code</CardTitle>
                <CardDescription>
                  Use your authenticator app to scan this QR code and add your SecureTransfer account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* QR Code */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">QR Code</p>
                        <p className="text-xs text-gray-400">Scan with your app</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Point your authenticator app's camera at this QR code
                    </p>
                  </div>

                  {/* Manual Setup */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-3">Can't scan? Enter manually:</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Account:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                            john@example.com
                          </code>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard("john@example.com")}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Secret Key:</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                            {qrCodeSecret}
                          </code>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(qrCodeSecret)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Verify Setup:</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the 6-digit code from your authenticator app to verify the setup:
                  </p>
                  <div className="flex gap-3">
                    <Input
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="max-w-32"
                      maxLength={6}
                    />
                    <Button onClick={handleVerifyCode} disabled={isVerifying || verificationCode.length !== 6}>
                      {isVerifying ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Backup Codes */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Step 3: Save Backup Codes
                </CardTitle>
                <CardDescription>
                  Store these backup codes in a safe place. You can use them to access your account if you lose your
                  authenticator device.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important:</p>
                  </div>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Each code can only be used once</li>
                    <li>• Store them in a secure location</li>
                    <li>• Don't share them with anyone</li>
                    <li>• Generate new codes if these are compromised</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-center">
                      <code className="text-sm font-mono">{code}</code>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={downloadBackupCodes} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Codes
                  </Button>
                  <Button variant="outline" onClick={() => copyToClipboard(backupCodes.join("\n"))} className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Codes
                  </Button>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Setup Complete!</p>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Two-factor authentication is now enabled for your account. You'll need to enter a code from your
                    authenticator app when signing in.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleComplete}>Complete Setup</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
