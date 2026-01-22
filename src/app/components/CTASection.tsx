// components/marketing/CTASection.tsx

import Image from 'next/image'
import { Button } from './ui/Button'

const userAvatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD1J__wC0LYBWy4qburzDDgFn7fiOxAvXMC5UPr59yrRlpx6Pbik_d70KrWXSSEMAV-tD6uc9V2uxz18SYtludxdo8a4i6EZALVRSlqupTJ11RhfLM_6HVvXSrlkhYmu6Atpmm4CHMPBwL2e9g0qJ939UEomjjegyIFmGDMg65rCGSzA2qxYv630Akp8LuMUOeYDT2Ss9K9DlHk-GhaMqEBwiAcRfXi-Er5IyViPHoxrf_6Z7weKhiTUrBOmJ4trJwby63LV6lFtDI',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB6Zu_FCZdg8dv0MFqr1r51byvC_g7EaB0r1v88yuhM1VQWaAtM5bxTEjBSSo-kyn6H2MP4WI8u_eguanFX0itfmL4LaNYQGa4uLhagqF7nWDwOIanlim_DcN6NtkdNlwquM3SvBmsgW45hyXNThg598YW0y7YrZJUd0Sb4hRdaEhQPiaHNhMxZQ-sP5Qe9jNGOhliP4TcB1c3iDjyEtOeFHN1G5MGjsaXkoahpuTcCPvG1VJ1RpNiLmZcuNDjkpqK_mgA5KIj7Z4U',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuArW9gP7nPTLb7p1QJILm5Sb-ydsVjG91c27JAeaRJiaVtIJrAkJcOvS-wdwqsqHhj9fh32XwR6Sdq0ZJcy0p36iowKZ9ARgQHbCxb9cs9M9ND3wdUlLLUXwg2P5D_hGhL-5TiPyGZXnJg2E8MwdUcRmwmyjlJJ3MLplAbG16NVa7oleHkmoYfzWDQMMYu590DWxZNtvR5Si6xfXbWOxNZou0YGsN_8RYA15V8n5GUfuXoQBWVeXnMMX6ptYBU3vooGohYxp7s5ctw'
]

export function CTASection() {
  return (
    <section className="my-20 bg-primary rounded-3xl p-12 lg:p-20 relative overflow-hidden text-center text-white">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 size-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex flex-col gap-4 max-w-[700px]">
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            Ready to master your marketing data?
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-medium">
            Join 500+ performance agencies scaling with QEFAS.
          </p>
        </div>

        <Button
          variant="secondary"
          size="2xl"
          className="bg-white text-primary hover:bg-slate-50"
        >
          Go to Analytics Dashboard
        </Button>

        {/* Trust Indicators */}
        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex -space-x-2">
            {userAvatars.map((avatar, index) => (
              <div
                key={index}
                className="relative size-8 rounded-full bg-slate-200 border-2 border-primary overflow-hidden"
              >
                <Image
                  src={avatar}
                  alt={`User avatar ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <span>Trusted by 2,000+ marketers</span>
        </div>
      </div>
    </section>
  )
}