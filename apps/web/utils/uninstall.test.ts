import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildTallyUrl,
  decodeUninstallContext,
  type UninstallContext,
} from './uninstall'

const context: UninstallContext = {
  anonymous_install_id: 'install-123',
  extensionVersion: '0.30.0',
  browser: 'chrome',
  store: 'chrome',
  locale: 'zh-CN',
  os: 'macOS',
  installedDays: '42',
  plan: 'free',
  channel: 'chrome-web-store',
}

test('simple fragment parameter carries only an anonymous install ID', () => {
  assert.deepEqual(
    decodeUninstallContext('#anonymous_install_id=install%20id%2F123'),
    {
      anonymous_install_id: 'install id/123',
    }
  )
})

test('fragment accepts independent query-style parameters', () => {
  assert.deepEqual(
    decodeUninstallContext(
      '#anonymous_install_id=install-123&browser=edge&extensionVersion=0.30.0&installedDays=42'
    ),
    {
      anonymous_install_id: 'install-123',
      browser: 'edge',
      extensionVersion: '0.30.0',
      installedDays: '42',
    }
  )
})

test('future fragment fields are forwarded without code changes', () => {
  assert.deepEqual(decodeUninstallContext('#future_metric=enabled'), {
    future_metric: 'enabled',
  })
  assert.equal(decodeUninstallContext(''), null)
})

test('Tally URL receives every context field without a field list', () => {
  const url = new URL(
    buildTallyUrl('form-id', {
      ...context,
      future_metric: 'enabled',
      dynamicHeight: '0',
    })
  )
  assert.equal(url.pathname, '/embed/form-id')
  assert.equal(url.searchParams.get('anonymous_install_id'), 'install-123')
  assert.equal(url.searchParams.has('schema_version'), false)
  assert.equal(url.searchParams.get('installedDays'), '42')
  assert.equal(url.searchParams.get('browser'), 'chrome')
  assert.equal(url.searchParams.get('future_metric'), 'enabled')
  assert.equal(url.searchParams.get('dynamicHeight'), '1')
})
