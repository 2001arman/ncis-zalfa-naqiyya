// Passenger startup file — loads the Next.js standalone server.
// Passenger sets PORT automatically; the standalone server reads it.
process.env.NODE_ENV = 'production'
process.chdir(__dirname)
require('./.next/standalone/server.js')
