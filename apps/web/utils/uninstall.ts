export type UninstallContext = Record<string, string>

export function decodeUninstallContext(
  fragment: string
): UninstallContext | null {
  const context = Object.fromEntries(
    new URLSearchParams(fragment.replace(/^#/, '')).entries()
  )
  return Object.keys(context).length ? context : null
}

export function buildTallyUrl(
  formId: string,
  context?: UninstallContext | null,
  mode: 'embed' | 'share' = 'embed'
): string {
  const base = `https://tally.so/${
    mode === 'embed' ? 'embed' : 'r'
  }/${encodeURIComponent(formId)}`
  const params = new URLSearchParams(context || undefined)

  if (mode === 'embed') {
    params.set('alignLeft', '1')
    params.set('hideTitle', '1')
    params.set('transparentBackground', '1')
    params.set('dynamicHeight', '1')
  }

  const query = params.toString()
  return query ? `${base}?${query}` : base
}
