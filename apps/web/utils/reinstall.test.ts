import assert from 'node:assert/strict'
import test from 'node:test'
import { getInstallTarget, resolveReinstallDestination } from './reinstall'

test('reinstall destinations only use the Edge and Chrome stores', () => {
  assert.equal(getInstallTarget({ store: 'edge' }).store, 'edge')
  assert.equal(getInstallTarget({ store: 'firefox' }).store, 'chrome')
  assert.equal(getInstallTarget({ store: '360' }).store, 'chrome')
  assert.match(
    getInstallTarget({ store: 'chrome' }).url,
    /^https:\/\/chromewebstore\.google\.com\//
  )
})

test('Chrome reinstall falls back to /download when Google is unreachable', async () => {
  const chrome = getInstallTarget({ store: 'chrome' })
  const edge = getInstallTarget({ store: 'edge' })

  assert.equal(
    await resolveReinstallDestination(chrome, async () => false),
    '/download'
  )
  assert.equal(
    await resolveReinstallDestination(chrome, async () => true),
    chrome.url
  )
  assert.equal(
    await resolveReinstallDestination(edge, async () => false),
    edge.url
  )
})
