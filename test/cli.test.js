const path = require('path')
const spawn = require('child_process').spawn
const test = require('tap').test
const helpers = require('./helpers')

const appPath = path.join(path.resolve(__dirname, '..', 'src', 'cli.js'))

test('displays help', (t) => {
  t.plan(1)
  const app = spawn('node', [appPath, '-h'])
  app.stdout.on('data', (data) => {
    const msg = data.toString()
    const res = (msg.indexOf('Usage:') >= 0)
    t.ok(res)
  })
})

test('displays version info', (t) => {
  t.plan(1)
  const app = spawn('node', [appPath, '-V'])
  app.stdout.on('data', (data) => {
    const msg = data.toString()
    const res = msg.startsWith(helpers.package.version)
    t.ok(res)
  })
})

test('throws on missing credentials', (t) => {
  t.plan(1)
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS
  const app = spawn('node', [appPath, '-p', 'project-id'])
  app.stdout.on('data', (data) => {
    const msg = data.toString()
    const res = (msg.indexOf('Credentials are missing') >= 0)
    t.ok(res)
  })
})

test('throws on missing project', (t) => {
  t.plan(1)
  delete process.env.PROJECT_ID
  const app = spawn('node', [appPath, '-c', './credentials.json'])
  app.stdout.on('data', (data) => {
    const msg = data.toString()
    const res = (msg.indexOf('Project is missing') >= 0)
    t.ok(res)
  })
})

test('picks up environment variables', (t) => {
  t.plan(1)
  process.env.GOOGLE_APPLICATION_CREDENTIALS = './credentials.json'
  process.env.PROJECT_ID = 'project-id'
  const app = spawn('node', [appPath])
  app.stdout.on('data', (data) => {
    const msg = data.toString()
    const res = (msg.indexOf('logging') >= 0)
    t.ok(res)
    app.kill()
  })
})

test('pipes data to output', (t) => {
  t.plan(1)

  delete process.env.PROJECT_ID
  const app = spawn('node', [appPath, '-c', './credentials.json', '-p', 'project-id'])
  app.stdout.on('data', (data) => {
    const msg = data.toString()
    const res = (msg.indexOf('logging') >= 0)
    t.ok(res)
    app.kill()
  })
})
