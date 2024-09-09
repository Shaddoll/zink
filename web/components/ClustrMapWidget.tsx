'use client'

import React, { useEffect, useRef } from 'react'

const ClustrMapsWidget = ({ id }: { id: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `//clustrmaps.com/map_v2.js?d=${id}cl=ffffff&w=a`
    script.id = 'clustermaps'
    script.type = 'text/javascript'

    const iframeDocument =
      iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document
    if (iframeDocument) {
      iframeDocument.body.appendChild(script)
    }
  }, [id])

  return (
    <iframe
      ref={iframeRef}
      title="ClustrMaps Tracking"
      style={{ width: '0', height: '0', border: 'none', overflow: 'hidden' }}
      aria-hidden="true"
    />
  )
}

export default ClustrMapsWidget
