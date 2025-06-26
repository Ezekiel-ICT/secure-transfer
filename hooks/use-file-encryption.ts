"use client"

import { useState, useCallback } from "react"

export function useFileEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)

  const generateKey = async (): Promise<CryptoKey> => {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    )
  }

  const encryptFile = useCallback(async (file: File, onProgress?: (progress: number) => void): Promise<ArrayBuffer> => {
    setIsEncrypting(true)

    try {
      // Generate encryption key
      const key = await generateKey()
      onProgress?.(20)

      // Generate IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      onProgress?.(40)

      // Read file as array buffer
      const fileBuffer = await file.arrayBuffer()
      onProgress?.(60)

      // Encrypt the file
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        fileBuffer,
      )
      onProgress?.(80)

      // Export key for storage
      const exportedKey = await window.crypto.subtle.exportKey("raw", key)
      onProgress?.(90)

      // Combine IV, key, and encrypted data
      const result = new ArrayBuffer(iv.length + exportedKey.byteLength + encryptedData.byteLength)
      const resultView = new Uint8Array(result)

      resultView.set(new Uint8Array(iv), 0)
      resultView.set(new Uint8Array(exportedKey), iv.length)
      resultView.set(new Uint8Array(encryptedData), iv.length + exportedKey.byteLength)

      onProgress?.(100)
      return result
    } finally {
      setIsEncrypting(false)
    }
  }, [])

  const decryptFile = useCallback(
    async (encryptedData: ArrayBuffer, onProgress?: (progress: number) => void): Promise<ArrayBuffer> => {
      setIsDecrypting(true)

      try {
        const dataView = new Uint8Array(encryptedData)

        // Extract IV (first 12 bytes)
        const iv = dataView.slice(0, 12)
        onProgress?.(20)

        // Extract key (next 32 bytes)
        const keyData = dataView.slice(12, 44)
        onProgress?.(40)

        // Extract encrypted content (remaining bytes)
        const encrypted = dataView.slice(44)
        onProgress?.(60)

        // Import the key
        const key = await window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["decrypt"])
        onProgress?.(80)

        // Decrypt the data
        const decryptedData = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: iv,
          },
          key,
          encrypted,
        )

        onProgress?.(100)
        return decryptedData
      } finally {
        setIsDecrypting(false)
      }
    },
    [],
  )

  return {
    encryptFile,
    decryptFile,
    isEncrypting,
    isDecrypting,
  }
}
