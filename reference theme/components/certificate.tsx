"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Share2, CheckCircle } from "lucide-react"

interface CertificateProps {
  id: string
  holderName: string
  pathName: string
  completionDate: string
  verificationId: string
  isPreview?: boolean
}

export function Certificate({
  id,
  holderName,
  pathName,
  completionDate,
  verificationId,
  isPreview = false,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!certificateRef.current) return
    
    // Dynamic import for html2canvas
    const html2canvas = (await import("html2canvas")).default
    const jsPDF = (await import("jspdf")).default
    
    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    })
    
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    })
    
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
    pdf.save(`blueprint-certificate-${verificationId}.pdf`)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/certificates/verify/${verificationId}`
    
    if (navigator.share) {
      await navigator.share({
        title: `${pathName} Certificate`,
        text: `I just completed the ${pathName} path on Blueprint!`,
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      alert("Certificate link copied to clipboard!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Certificate */}
      <div
        ref={certificateRef}
        className="relative bg-white aspect-[1.414/1] max-w-3xl mx-auto overflow-hidden"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Decorative border */}
        <div className="absolute inset-4 border-4 border-double border-primary/30" />
        <div className="absolute inset-6 border border-primary/20" />
        
        {/* Corner decorations */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-primary/40" />
        <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-primary/40" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-primary/40" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-primary/40" />
        
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="text-9xl font-bold text-primary transform -rotate-45">
            BLUEPRINT
          </div>
        </div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-7 h-7 text-primary-foreground"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-800">Blueprint</span>
          </div>
          
          {/* Title */}
          <h1 className="text-lg font-medium text-slate-500 uppercase tracking-[0.3em] mb-2">
            Certificate of Completion
          </h1>
          
          {/* Divider */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mb-6" />
          
          {/* Main text */}
          <p className="text-slate-600 mb-4">This is to certify that</p>
          
          <h2 className="text-4xl font-serif font-bold text-slate-800 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {holderName}
          </h2>
          
          <p className="text-slate-600 mb-4">has successfully completed the</p>
          
          <h3 className="text-2xl font-bold text-primary mb-6">
            {pathName}
          </h3>
          
          <p className="text-slate-600 mb-8">
            learning path on Blueprint, demonstrating proficiency in the required skills and concepts.
          </p>
          
          {/* Date and verification */}
          <div className="flex items-center gap-12">
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-1">Date of Completion</p>
              <p className="font-semibold text-slate-800">{completionDate}</p>
            </div>
            
            <div className="w-px h-12 bg-slate-200" />
            
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-1">Verification ID</p>
              <p className="font-mono font-semibold text-primary">{verificationId}</p>
            </div>
          </div>
          
          {/* Seal */}
          <div className="absolute bottom-12 right-16">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="absolute bottom-6 text-xs text-slate-400">
            Verify at blueprint.dev/certificates/verify/{verificationId}
          </p>
        </div>
      </div>
      
      {/* Actions */}
      {!isPreview && (
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      )}
    </div>
  )
}

// Certificate verification page component
export function CertificateVerification({
  certificate,
  isValid,
}: {
  certificate: {
    holderName: string
    pathName: string
    completionDate: string
    verificationId: string
  } | null
  isValid: boolean
}) {
  if (!isValid || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Certificate Not Found</h1>
          <p className="text-muted-foreground">
            This certificate could not be verified. It may be invalid or has been revoked.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Verification badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-green-600 font-medium">Verified Certificate</span>
        </div>
        
        <Certificate
          id={certificate.verificationId}
          holderName={certificate.holderName}
          pathName={certificate.pathName}
          completionDate={certificate.completionDate}
          verificationId={certificate.verificationId}
          isPreview
        />
      </div>
    </div>
  )
}
