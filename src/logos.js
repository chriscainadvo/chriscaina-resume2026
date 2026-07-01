import * as THREE from 'three'
import {
  siClaude,
  siPerplexity,
  siGooglegemini,
  siNotion,
  siZapier,
  siN8n,
  siVercel,
  siGithub,
  siCursor,
  siAirtable,
  siGodaddy,
  siHubspot,
  siMake,
  siCalendly,
  siStripe,
  siFigma,
  siLinear,
  siGmail,
  siElevenlabs,
  siHuggingface,
  siSupabase,
  siCloudflare,
  siWebflow,
  siDiscord,
} from 'simple-icons'

// OpenAI / ChatGPT mark isn't in simple-icons (trademark policy) — embed the path.
const OPENAI_PATH =
  'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.1419.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.1419.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z'

// hex = brand color (used to tint each tile + draw the logo)
export const TOOLS = [
  { title: 'Claude', path: siClaude.path, hex: '#D97757' },
  { title: 'ChatGPT', path: OPENAI_PATH, hex: '#10A37F' },
  { title: 'Perplexity', path: siPerplexity.path, hex: '#1FB8CD' },
  { title: 'Gemini', path: siGooglegemini.path, hex: '#8E75B2' },
  { title: 'Notion', path: siNotion.path, hex: '#2F3437' },
  { title: 'Zapier', path: siZapier.path, hex: '#FF4F00' },
  { title: 'n8n', path: siN8n.path, hex: '#EA4B71' },
  { title: 'Vercel', path: siVercel.path, hex: '#3A3A3A' },
  { title: 'GitHub', path: siGithub.path, hex: '#4A4F55' },
  { title: 'Cursor', path: siCursor.path, hex: '#5B6470' },
  { title: 'Airtable', path: siAirtable.path, hex: '#1CA7EC' },
  { title: 'GoDaddy', path: siGodaddy.path, hex: '#1BC2C2' },
  { title: 'HubSpot', path: siHubspot.path, hex: '#FF7A59' },
  { title: 'Make', path: siMake.path, hex: '#8A4DEB' },
  { title: 'Calendly', path: siCalendly.path, hex: '#006BFF' },
  { title: 'Stripe', path: siStripe.path, hex: '#635BFF' },
  { title: 'Figma', path: siFigma.path, hex: '#E2603F' },
  { title: 'Linear', path: siLinear.path, hex: '#5E6AD2' },
  { title: 'Gmail', path: siGmail.path, hex: '#EA4335' },
  { title: 'ElevenLabs', path: siElevenlabs.path, hex: '#5B6470' },
  { title: 'HuggingFace', path: siHuggingface.path, hex: '#E3A008' },
  { title: 'Supabase', path: siSupabase.path, hex: '#3FCF8E' },
  { title: 'Cloudflare', path: siCloudflare.path, hex: '#F38020' },
  { title: 'Webflow', path: siWebflow.path, hex: '#3D7EFF' },
  { title: 'Discord', path: siDiscord.path, hex: '#5865F2' },
]

const cache = new Map()

/* Render a brand SVG path (24x24 viewBox) to a centered canvas texture.
   Pass `color` to override the brand hex (e.g. monochrome white). */
export function makeLogoTexture(tool, color = '#2a3343') {
  const key = `${tool.title}|${color}`
  if (cache.has(key)) return cache.get(key)
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, size, size)

  const pad = size * 0.19 // smaller pad → bigger logo on the tile
  const draw = size - pad * 2
  const scale = draw / 24
  ctx.save()
  ctx.translate(pad, pad)
  ctx.scale(scale, scale)
  ctx.fillStyle = color
  ctx.fill(new Path2D(tool.path))
  ctx.restore()

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  cache.set(key, tex)
  return tex
}
